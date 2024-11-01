import React from 'react';
type IUseDoubleClickProps = {
    /** Set to false to disable onDoubleClick/onSingleClick  */
    enabled?: boolean;
    /** The amount of time (in milliseconds) to wait before differentiating a single from a double click */
    latency?: number;
    /** A callback function for double click events */
    onDoubleClick?: (event: MouseEvent) => void;
    /** A callback function for single click events */
    onSingleClick?: (event: MouseEvent) => void;
    /** Dom node to watch for double clicks */
    ref: React.RefObject<HTMLElement>;
};
/**
 * React Hook that returns the current window size
 * and report updates from the 'resize' window event
 */
declare const useDoubleClick: ({ enabled, latency, onDoubleClick, onSingleClick, ref, }: IUseDoubleClickProps) => void;
export default useDoubleClick;
