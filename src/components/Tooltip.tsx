'use client';

import {
  cloneElement,
  useState,
  useRef,
  useCallback,
  useId,
  useEffect,
  useLayoutEffect,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const oppositePosition: Record<TooltipPosition, TooltipPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const viewportPadding = 8;
const tooltipGap = 8;
const hoverBridgeDelay = 100;

interface TooltipCoordinates {
  top: number;
  left: number;
  ready: boolean;
  placement: TooltipPosition;
}

function positionTooltip(
  preferred: TooltipPosition,
  trigger: DOMRect,
  tooltip: DOMRect
): TooltipCoordinates {
  const fits: Record<TooltipPosition, boolean> = {
    top: trigger.top - tooltipGap - tooltip.height >= viewportPadding,
    bottom: trigger.bottom + tooltipGap + tooltip.height <= window.innerHeight - viewportPadding,
    left: trigger.left - tooltipGap - tooltip.width >= viewportPadding,
    right: trigger.right + tooltipGap + tooltip.width <= window.innerWidth - viewportPadding,
  };
  const resolved = fits[preferred] || !fits[oppositePosition[preferred]]
    ? preferred
    : oppositePosition[preferred];

  let top = trigger.top + trigger.height / 2 - tooltip.height / 2;
  let left = trigger.left + trigger.width / 2 - tooltip.width / 2;

  if (resolved === 'top') top = trigger.top - tooltip.height - tooltipGap;
  if (resolved === 'bottom') top = trigger.bottom + tooltipGap;
  if (resolved === 'left') left = trigger.left - tooltip.width - tooltipGap;
  if (resolved === 'right') left = trigger.right + tooltipGap;

  return {
    top: Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltip.height - viewportPadding)),
    left: Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltip.width - viewportPadding)),
    ready: true,
    placement: resolved,
  };
}

export interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactElement<{
    'aria-describedby'?: string;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    onTouchStart?: React.TouchEventHandler;
  }>;
  className?: string;
}

export default function Tooltip({
  content,
  position = 'top',
  delay = 300,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<TooltipCoordinates>({
    top: 0,
    left: 0,
    ready: false,
    placement: position,
  });
  const showTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const id = useId();
  const tooltipId = `${id}-tooltip`;

  const show = useCallback(() => {
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
    showTimerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
    setVisible(false);
    setCoordinates((current) => ({ ...current, ready: false }));
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(hide, hoverBridgeDelay);
  }, [hide]);

  const cancelScheduledHide = useCallback(() => {
    clearTimeout(hideTimerRef.current);
  }, []);

  const handleTouchStart = useCallback(() => {
    if (visible) hide();
    else {
      clearTimeout(showTimerRef.current);
      setVisible(true);
    }
  }, [hide, visible]);

  useLayoutEffect(() => {
    if (!visible) return;

    const updatePosition = () => {
      if (!wrapperRef.current || !tooltipRef.current) return;
      setCoordinates(positionTooltip(
        position,
        wrapperRef.current.getBoundingClientRect(),
        tooltipRef.current.getBoundingClientRect()
      ));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [position, visible]);

  useEffect(() => {
    if (!visible) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') hide();
    }

    function handleOutsideTouch(e: TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        hide();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleOutsideTouch);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleOutsideTouch);
    };
  }, [hide, visible]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  // cloneElement reads immutable element props, not a mutable ref value.
  // eslint-disable-next-line react-hooks/refs
  const trigger = cloneElement(children, {
    'aria-describedby': visible
      ? [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ')
      : children.props['aria-describedby'],
    onMouseEnter: (event) => {
      children.props.onMouseEnter?.(event);
      show();
    },
    onMouseLeave: (event) => {
      children.props.onMouseLeave?.(event);
      scheduleHide();
    },
    onFocus: (event) => {
      children.props.onFocus?.(event);
      show();
    },
    onBlur: (event) => {
      children.props.onBlur?.(event);
      hide();
    },
    onTouchStart: (event) => {
      children.props.onTouchStart?.(event);
      handleTouchStart();
    },
  });

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      {trigger}

      {visible && typeof document !== 'undefined'
        ? createPortal(
            <span
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              data-position={coordinates.placement}
              onMouseEnter={cancelScheduledHide}
              onMouseLeave={scheduleHide}
              style={{
                position: 'fixed',
                top: coordinates.top,
                left: coordinates.left,
                visibility: coordinates.ready ? 'visible' : 'hidden',
              } as CSSProperties}
              className={cn(
                'z-tooltip w-max max-w-[240px] whitespace-normal break-words rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text2 shadow-elevation-medium',
                'animate-tooltip-in',
                className
              )}
            >
              {content}
            </span>,
            document.body
          )
        : null}
    </span>
  );
}
