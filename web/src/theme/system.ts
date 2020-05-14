import {
  AlignContentProps,
  AlignItemsProps,
  AlignSelfProps,
  BackgroundProps,
  ColorProps,
  FlexBasisProps,
  FlexDirectionProps,
  FlexProps,
  FlexWrapProps,
  FontFamilyProps,
  FontSizeProps,
  FontWeightProps,
  GridAutoColumnsProps,
  GridAutoFlowProps,
  GridAutoRowsProps,
  GridColumnGapProps,
  GridGapProps,
  GridRowGapProps,
  GridTemplateColumnsProps,
  GridTemplateRowsProps,
  HeightProps,
  JustifyContentProps,
  JustifySelfProps,
  MaxHeightProps,
  MaxWidthProps,
  MinHeightProps,
  MinWidthProps,
  SizeProps,
  TextAlignProps,
  WidthProps,
} from "styled-system";

export interface ColoringProps extends BackgroundProps, ColorProps {}

export interface FlexLayoutProps
  extends FlexWrapProps,
    FlexBasisProps,
    FlexProps,
    FlexDirectionProps {}

export interface GridLayoutProps
  extends GridAutoFlowProps,
    GridAutoRowsProps,
    GridAutoColumnsProps,
    GridGapProps,
    GridRowGapProps,
    GridColumnGapProps,
    GridTemplateRowsProps,
    GridTemplateColumnsProps {}

export interface TypographyProps
  extends FontSizeProps,
    FontWeightProps,
    FontFamilyProps,
    TextAlignProps {}

export interface ChildPositioningProps
  extends AlignItemsProps,
    AlignContentProps,
    JustifyContentProps {}
export interface SelfPositioningProps
  extends AlignSelfProps,
    JustifySelfProps {}

export interface SizingProps
  extends SizeProps,
    MinHeightProps,
    MaxHeightProps,
    HeightProps,
    MinWidthProps,
    MaxWidthProps,
    WidthProps {}
