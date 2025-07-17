import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PixelTableCell = styled(TableCell)(() => ({
  fontFamily: "Press Start 2P, monospace",
  backgroundColor: "#cacaca",
  color: "#000",
  border: "2px solid #898989",
  padding: "8px",
  fontSize: "1rem",
  textAlign: "center",
}));

const PixelTableContainer = styled(TableContainer)(() => ({
  border: "4px solid #000",
  borderRadius: "0px",
  backgroundColor: "#cacaca",
  width: "60%",
  marginTop: "32px",
}));

const PixelRankingTable = ({
  ranking,
}: {
  ranking: { name: string; score: number }[];
}) => {
  return (
    <PixelTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <PixelTableCell className="pixel-font">Posición</PixelTableCell>
            <PixelTableCell className="pixel-font">Jugador</PixelTableCell>
            <PixelTableCell className="pixel-font">Puntaje</PixelTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ranking.map((entry, index) => (
            <TableRow key={index}>
              <PixelTableCell className="pixel-font">
                {index + 1}
              </PixelTableCell>
              <PixelTableCell className="pixel-font">
                {entry.name}
              </PixelTableCell>
              <PixelTableCell className="pixel-font">
                {entry.score}
              </PixelTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PixelTableContainer>
  );
};

export default PixelRankingTable;
