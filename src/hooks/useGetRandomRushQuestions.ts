import { sampleSize } from "lodash";
import { GameplayModeEnums } from "../enums/conurbanoGameEnums";
import { conurbanoQuestions, futbolQuestions, monumentQuestions } from "../constants/questionOptions";
import { Question } from "../dto/conurbanoGamesDto.dto";

export function getRandomRushQuestions(mode: GameplayModeEnums): Question[] {
    switch (mode) {
        case GameplayModeEnums.FUTBOL:
            return sampleSize(futbolQuestions, 3);
        case GameplayModeEnums.MONUMENTOS:
            return sampleSize(monumentQuestions, 3);
        default:
            return sampleSize(conurbanoQuestions, 3);
    }
}
