import { cn } from "utils/class-names";
import { BOTCCharacter } from "./characters";

interface BOTCCharacterPanelProps {
  name: string;
  description: string;
  selected: boolean;
  showDescription: boolean;
};

const BOTCCharacterPanel = ({name, description, selected, showDescription}: BOTCCharacterPanelProps) => {
  return (
    <div className={cn("flex flex-col gap-2", selected && 'bg-red-600/20')}>
      <h4>{name}</h4>
      {showDescription && <p className="text-sm">{description}</p>}
    </div>
  )
}

export default BOTCCharacterPanel;
