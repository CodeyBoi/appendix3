import { Color, Fill, Shape } from "./card";

type Point = [number, number];

export interface SetIconProps {
  shape: Shape;
  color: Color;
  fill: Fill;
}

const Icon = ({shape, color, fill}: SetIconProps) => {
  return (
    <div>
      {color}<br />
      {fill}<br />
      {shape}
    </div>
  )
}

export default Icon
