import Icon, { SetIconProps } from "./icon";

export type Shape = 'wave' | 'oval' | 'diamond';
export type Color = 'red' | 'blue' | 'yellow';
export type Fill = 'solid' | 'striped' | 'clear';
export type Amount = 'one' | 'two' | 'three';


const Card = ({ shape, color, fill, amount }: Card) => {
  return (
    <div className='flex flex-col gap-2 w-8 h-12 border rounded shadow-md'>
      <p>{amount}</p>
      <Icon shape={shape} color={color} fill={fill} />
    </div>
  )
}

export default Card;
