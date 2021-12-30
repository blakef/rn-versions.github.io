import type {
  AreaProps,
  CartesianGridProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";

type AnimationTimingProps = "animationDuration" | "animationEasing";
type DimensionProps = "width" | "height";
type PaddingProps = "padding";
type StrokeProps = "stroke" | "strokeDasharray" | "strokeOpacity";
type TickProps =
  | "tick"
  | "tickCount"
  | "tickLine"
  | "tickSize"
  | "tickMargin"
  | "minTickGap";

export type VersionDownloadChartStyle = {
  areaChart: {
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
  };
  area: Pick<AreaProps, DimensionProps | "isAnimationActive">;
  responsiveContainer: Pick<ResponsiveContainerProps, DimensionProps>;
  grid: Pick<CartesianGridProps, DimensionProps | StrokeProps>;
  xAxis: Pick<XAxisProps, DimensionProps | PaddingProps | TickProps>;
  yAxis: Pick<YAxisProps, DimensionProps | PaddingProps | TickProps>;
  tooltip: Pick<TooltipProps<string, number>, AnimationTimingProps>;
};

const styles: VersionDownloadChartStyle = {
  areaChart: {
    margin: { top: 20, right: 20, bottom: 10 },
  },
  area: {
    isAnimationActive: false,
  },
  responsiveContainer: {
    width: "100%",
    height: 230,
  },
  grid: {
    strokeDasharray: "1 4",
  },
  xAxis: {
    height: 32,
    tickLine: false,
    tickMargin: 10,
  },
  yAxis: {
    width: 80,
    tickLine: false,
    tickMargin: 10,
    tickSize: 0,
    tickCount: 5,
  },
  tooltip: {
    animationDuration: 300,
    animationEasing: "ease-in-out",
  },
};

export default styles;
