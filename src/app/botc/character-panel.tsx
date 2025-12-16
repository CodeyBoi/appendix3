import { cn } from "utils/class-names";
import { BOTCCharacter } from "./characters";

interface BOTCCharacterPanelProps {
  name: string;
  description: string;
  showDescription: boolean;
};

const BOTCCharacterPanel = ({name, description, showDescription}: BOTCCharacterPanelProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h4>{name}</h4>
      {showDescription && <p className="text-sm">{description}</p>}
    </div>
  )
}

export default BOTCCharacterPanel;
