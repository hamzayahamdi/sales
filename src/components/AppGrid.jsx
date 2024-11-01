// components
import {Responsive, WidthProvider} from 'react-grid-layout';
import {withSize} from 'react-sizeme';

// layouts
import layouts from '../layouts';

// hooks
import {useWindowSize} from 'react-use';

// utils
import PropTypes from 'prop-types';

const ResponsiveGridLayout = withSize({refreshMode: 'debounce'})(WidthProvider(Responsive));

const AppGrid = ({widgets, id, cols, gridBreakpoints}) => {
    const {width} = useWindowSize();
    const breakpoints = {
        md: width >= 768 && width < 1280,
        lg: width >= 1280 && width < 1440,
        xl: width >= 1440
    }

    const drawWidgets = () => {
        return Object.keys(widgets).map(widget => {
            const isAnalyticsWidget = widget === 'sales_analytics' || widget === 'sales_by_category';
            const widgetClasses = isAnalyticsWidget ? 'mt-6 md:mt-8' : '';
            
            return (
                <div key={widget} className={widgetClasses}>
                    {widgets[widget]}
                </div>
            )
        })
    }

    return (
        <div className="w-full">
            {
                width >= 768 ?
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={layouts[id]}
                        breakpoints={gridBreakpoints || breakpoints}
                        cols={cols ? cols : {xl: 3, lg: 3, md: 2}}
                        rowHeight={width >= 1280 ? 180 : 188}
                        isDraggable={false}
                        isResizable={false}
                        margin={[32, 32]}
                        containerPadding={[32, 0]}
                        useCSSTransforms={false}
                    >
                        {drawWidgets()}
                    </ResponsiveGridLayout>
                    :
                    <div className="grid grid-cols-1 gap-6">
                        {drawWidgets()}
                    </div>
            }
        </div>
    )
}

AppGrid.propTypes = {
    widgets: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    cols: PropTypes.object,
    gridBreakpoints: PropTypes.object
}

export default AppGrid;