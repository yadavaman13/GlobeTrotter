import React, { useState } from 'react';
import AccordionItem from './AccordionItem';
import './Accordion.scss';

/**
 * Shared Modular Accordion Component
 * Supports single & multiple expansion modes, 4 design variants, and 3 size presets.
 */
function Accordion({
    items,
    defaultExpanded,
    expanded: controlledExpanded,
    onChange,
    allowMultiple = false,
    variant = 'default', // 'default' | 'bordered' | 'filled' | 'ghost'
    size = 'md', // 'sm' | 'md' | 'lg'
    className = '',
    children,
}) {
    // Normalize defaultExpanded into an Array
    const initExpanded = () => {
        if (defaultExpanded === undefined) return [];
        return Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded];
    };

    const [internalExpanded, setInternalExpanded] = useState(initExpanded);

    // Determine active expanded array (controlled vs uncontrolled)
    const activeExpanded =
        controlledExpanded !== undefined
            ? Array.isArray(controlledExpanded)
                ? controlledExpanded
                : [controlledExpanded]
            : internalExpanded;

    const handleToggleItem = (id) => {
        let nextExpanded;

        if (allowMultiple) {
            if (activeExpanded.includes(id)) {
                nextExpanded = activeExpanded.filter((itemId) => itemId !== id);
            } else {
                nextExpanded = [...activeExpanded, id];
            }
        } else {
            if (activeExpanded.includes(id)) {
                nextExpanded = [];
            } else {
                nextExpanded = [id];
            }
        }

        if (controlledExpanded === undefined) {
            setInternalExpanded(nextExpanded);
        }

        if (onChange) {
            onChange(allowMultiple ? nextExpanded : nextExpanded[0] || null);
        }
    };

    return (
        <div className={`shared-accordion-container variant-${variant} size-${size} ${className}`}>
            {/* 1. Data-Driven API with items prop */}
            {items && items.length > 0
                ? items.map((item) => (
                      <AccordionItem
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          subtitle={item.subtitle}
                          icon={item.icon}
                          badge={item.badge}
                          badgeVariant={item.badgeVariant}
                          badgeType={item.badgeType}
                          disabled={item.disabled}
                          isExpanded={activeExpanded.includes(item.id)}
                          onToggle={handleToggleItem}
                          extraActions={item.extraActions}
                      >
                          {item.content}
                      </AccordionItem>
                  ))
                : /* 2. Declarative Composition with children */
                  React.Children.map(children, (child) => {
                      if (!React.isValidElement(child)) return null;

                      const childId = child.props.id || child.key;
                      const isExpanded = activeExpanded.includes(childId);

                      return React.cloneElement(child, {
                          id: childId,
                          isExpanded:
                              child.props.isExpanded !== undefined
                                  ? child.props.isExpanded
                                  : isExpanded,
                          onToggle: (id, e) => {
                              if (child.props.onToggle) child.props.onToggle(id, e);
                              handleToggleItem(id);
                          },
                      });
                  })}
        </div>
    );
}

export default Accordion;
