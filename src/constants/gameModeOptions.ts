import { ConurbanoIcon, MonumentosIcon } from "../assets/gamemode-icon";
import { GameplayModeEnums } from "../enums/conurbanoGameEnums";

export const modeOptions = [
    {
        mode: GameplayModeEnums.NORMAL,
        label: "Clásico",
        image: ConurbanoIcon,
    },
    {
        mode: GameplayModeEnums.MONUMENTOS,
        label: "Monumentos",
        image: MonumentosIcon,
    },
];
