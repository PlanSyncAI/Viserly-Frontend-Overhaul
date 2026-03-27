import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, X, GripVertical, DollarSign, Calendar, Flame, Snowflake, Sun } from 'lucide-react'
import { STAGE_DOT_COLORS, PRIORITY_STYLES, DEAL_STAGES } from '../../lib/pipelineData'

const PRIORITY_ICONS = {
  Hot: Flame,
  Warm: Sun,
  Cold: Snowflake,
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days}d`
}

/* ─── Draggable Card ──────────────────────────────────────────────────────── */
function DraggableCard({ deal, onDealClick, isSelected, onToggleSelect, hasSelection }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `deal-${deal.id}`,
    data: { type: 'deal', deal },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const PriorityIcon = PRIORITY_ICONS[deal.priority] || Sun
  const initials = deal.participantName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const nextDate = formatRelativeDate(deal.nextActionDate)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => hasSelection ? onToggleSelect(deal.id) : onDealClick(deal.id)}
      className={`touch-none rounded-2xl border transition-all duration-200 cursor-pointer select-none overflow-hidden ${
        isDragging
          ? 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 shadow-xl ring-2 ring-primary-500/30'
          : isSelected
            ? 'bg-primary-50/60 dark:bg-primary-500/10 border-primary-300 dark:border-primary-500/40 ring-1 ring-primary-200 dark:ring-primary-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-200 dark:hover:border-slate-700'
      }`}
    >
      {/* Card content */}
      <div className="p-4">
        {/* Top row: checkbox + name + priority */}
        <div className="flex items-start gap-2.5 mb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSelect(deal.id) }}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
              isSelected
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
            }`}
          >
            {isSelected && <Check size={12} strokeWidth={3} />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-bold">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate">{deal.participantName}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{deal.accountName}</p>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${PRIORITY_STYLES[deal.priority]}`}>
            <PriorityIcon size={10} />
            {deal.priority}
          </span>
        </div>

        {/* Value row */}
        <div className="flex items-center justify-between mb-3 ml-[30px]">
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} className="text-emerald-500" />
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              ${deal.dealValue.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full tabular-nums">
            ${deal.estimatedRevenue.toLocaleString()} rev
          </span>
        </div>

        {/* Bottom row: source + next action */}
        <div className="flex items-center justify-between ml-[30px]">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">{deal.source}</p>
          <div className="flex items-center gap-1">
            {nextDate && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                nextDate === 'Overdue'
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
                  : nextDate === 'Today' || nextDate === 'Tomorrow'
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
              }`}>
                <Calendar size={9} />
                {nextDate}
              </span>
            )}
            <GripVertical size={12} className="text-slate-300 dark:text-slate-600 shrink-0 ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Overlay Card (shown while dragging) ─────────────────────────────────── */
function OverlayCard({ deal, extraCount }) {
  const PriorityIcon = PRIORITY_ICONS[deal.priority] || Sun
  return (
    <div className="relative">
      {extraCount > 0 && (
        <>
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-2xl translate-x-2 translate-y-2 rotate-2" />
          {extraCount > 1 && (
            <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-2xl translate-x-4 translate-y-4 rotate-4" />
          )}
        </>
      )}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-primary-300 dark:border-primary-500 shadow-2xl shadow-primary-500/20 p-4 w-72 rotate-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-bold">
                {deal.participantName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate">{deal.participantName}</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${PRIORITY_STYLES[deal.priority]}`}>
            <PriorityIcon size={10} />
            {deal.priority}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 ml-9">{deal.accountName}</p>
        <div className="flex items-center gap-1.5 ml-9">
          <DollarSign size={13} className="text-emerald-500" />
          <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
            ${deal.dealValue.toLocaleString()}
          </p>
        </div>
        {extraCount > 0 && (
          <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-500/30 text-center">
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
              +{extraCount} more deal{extraCount > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Selection Bar ───────────────────────────────────────────────────────── */
function SelectionBar({ count, onClear }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 mb-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white tabular-nums">{count}</span>
        </div>
        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
          deal{count > 1 ? 's' : ''} selected
        </span>
        <span className="text-xs text-primary-500/70 dark:text-primary-400/70">
          — hold & drag to move them together
        </span>
      </div>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors cursor-pointer"
      >
        <X size={12} />
        Clear
      </button>
    </div>
  )
}

/* ─── Droppable Column ────────────────────────────────────────────────────── */
function KanbanColumn({ stage, deals, onDealClick, isOver, selectedIds, onToggleSelect, hasSelection }) {
  const { setNodeRef } = useDroppable({
    id: `stage-${stage.key}`,
    data: { type: 'stage', stageKey: stage.key },
  })

  const totalValue = deals.reduce((sum, d) => sum + d.dealValue, 0)

  return (
    <div
      ref={setNodeRef}
      className={`w-[85vw] sm:w-[280px] flex-shrink-0 flex flex-col rounded-2xl border transition-all duration-200 ${
        isOver
          ? 'bg-primary-50/50 dark:bg-primary-500/5 border-primary-300 dark:border-primary-500/40 ring-1 ring-primary-200 dark:ring-primary-500/20'
          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800'
      }`}
    >
      {/* Column header */}
      <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${STAGE_DOT_COLORS[stage.key]}`} />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{stage.label}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 tabular-nums">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
            ${(totalValue / 1000).toFixed(0)}K
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-420px)] min-h-[120px]">
        {deals.map((deal) => (
          <DraggableCard
            key={deal.id}
            deal={deal}
            onDealClick={onDealClick}
            isSelected={selectedIds.has(deal.id)}
            onToggleSelect={onToggleSelect}
            hasSelection={hasSelection}
          />
        ))}
        {deals.length === 0 && (
          <div className={`text-xs text-center py-8 rounded-xl border-2 border-dashed transition-colors ${
            isOver
              ? 'border-primary-300 dark:border-primary-500/40 text-primary-400 dark:text-primary-500 bg-primary-50/30 dark:bg-primary-500/5'
              : 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'
          }`}>
            {isOver ? 'Drop here' : 'No deals'}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Board ───────────────────────────────────────────────────────────────── */
export default function KanbanBoard({ deals, stages = DEAL_STAGES, onStageChange, onBulkStageChange, onDealClick }) {
  const [activeDeal, setActiveDeal] = useState(null)
  const [overStage, setOverStage] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 120, tolerance: 5 },
    })
  )

  const grouped = {}
  stages.forEach((s) => { grouped[s.key] = [] })
  deals.forEach((d) => {
    if (grouped[d.stage]) grouped[d.stage].push(d)
  })

  const toggleSelect = useCallback((dealId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(dealId)) next.delete(dealId)
      else next.add(dealId)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const dragCount = activeDeal && selectedIds.has(activeDeal.id)
    ? selectedIds.size - 1
    : 0

  function handleDragStart(event) {
    const deal = event.active.data.current?.deal
    if (!deal) return
    setActiveDeal(deal)
    if (!selectedIds.has(deal.id)) {
      setSelectedIds(new Set([deal.id]))
    }
  }

  function handleDragOver(event) {
    const { over } = event
    if (!over) { setOverStage(null); return }
    if (over.data.current?.type === 'stage') {
      setOverStage(over.data.current.stageKey)
    } else if (over.data.current?.type === 'deal') {
      setOverStage(over.data.current.deal.stage)
    } else {
      setOverStage(null)
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveDeal(null)
    setOverStage(null)

    if (!over || !active) return
    const deal = active.data.current?.deal
    if (!deal) return

    let targetStage = null
    if (over.data.current?.type === 'stage') {
      targetStage = over.data.current.stageKey
    } else if (over.data.current?.type === 'deal') {
      targetStage = over.data.current.deal.stage
    }

    if (!targetStage) return

    const idsToMove = selectedIds.has(deal.id)
      ? [...selectedIds].filter((id) => {
          const d = deals.find((dd) => dd.id === id)
          return d && d.stage !== targetStage
        })
      : deal.stage !== targetStage ? [deal.id] : []

    if (idsToMove.length > 0) {
      onBulkStageChange(idsToMove, targetStage)
    }

    setSelectedIds(new Set())
  }

  function customCollision(args) {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) return pointerCollisions
    return rectIntersection(args)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollision}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {selectedIds.size > 0 && !activeDeal && (
        <SelectionBar count={selectedIds.size} onClear={clearSelection} />
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 kanban-scroll">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage}
            deals={grouped[stage.key] || []}
            onDealClick={onDealClick}
            isOver={overStage === stage.key}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            hasSelection={selectedIds.size > 0}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeDeal ? <OverlayCard deal={activeDeal} extraCount={dragCount} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
