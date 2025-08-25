import Card from "./card"

export type Shape = 'wave' | 'oval' | 'diamond';
export type Color = 'red' | 'blue' | 'yellow';
export type Fill = 'solid' | 'striped' | 'clear';
export type Amount = 'one' | 'two' | 'three';

export interface Card {
  amount: Amount;
  shape: Shape;
  color: Color;
  fill: Fill;
}

const SetPage = () => {
  return (
    <Card amount='two' color='red' fill='striped' shape='oval' />
  )
}

export default SetPage
