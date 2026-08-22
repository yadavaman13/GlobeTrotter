import KanbanCardHeader from './KanbanCardHeader';
import KanbanCardTitleRow from './KanbanCardTitleRow';
import KanbanCardFields from './KanbanCardFields';
import KanbanCardTags from './KanbanCardTags';
import KanbanCardProgress from './KanbanCardProgress';
import KanbanCardFooter from './KanbanCardFooter';

function KanbanCard({ item, onCardClick, onActionClick, onDragStart, onDragEnd }) {
    const {
        title,
        subtitle,
        badge,
        avatar,
        fields,
        description,
        updatedText,
        progress,
        commentsCount,
        subtasksCount,
        assignees,
        tags,
        progressVariant,
        showActions = true,
    } = item;

    return (
        <div
            className="kanban-card"
            draggable
            onDragStart={(e) => onDragStart && onDragStart(e, item)}
            onDragEnd={(e) => onDragEnd && onDragEnd(e, item)}
            onClick={() => onCardClick && onCardClick(item)}
        >
            <KanbanCardHeader
                updatedText={updatedText}
                showActions={showActions}
                item={item}
                onActionClick={onActionClick}
            />

            <KanbanCardTitleRow title={title} subtitle={subtitle} badge={badge} avatar={avatar} />

            {description && <p className="kanban-card-description">{description}</p>}

            <KanbanCardFields fields={fields} />
            <KanbanCardTags tags={tags} />
            <KanbanCardProgress progress={progress} progressVariant={progressVariant} />
            <KanbanCardFooter
                commentsCount={commentsCount}
                subtasksCount={subtasksCount}
                assignees={assignees}
            />
        </div>
    );
}

export default KanbanCard;
