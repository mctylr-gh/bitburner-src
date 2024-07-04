import React from "react";

import { enterBitNode } from "../../RedPill";
import { BitNodes } from "../BitNode";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BitnodeMultiplierDescription } from "./BitnodeMultipliersDescription";

interface IProps {
  open: boolean;
  onClose: () => void;
  n: number;
  level: number;
  destroyedBitNode: number;
  flume: boolean;
}

export function PortalModal(props: IProps): React.ReactElement {
  const bitNodeKey = "BitNode" + props.n;
  const bitNode = BitNodes[bitNodeKey];
  if (bitNode == null) throw new Error(`Could not find BitNode object for number: ${props.n}`);
  const maxSourceFileLevel = props.n === 12 ? "∞" : "3";

  const newLevel = Math.min(props.level + 1, props.n === 12 ? Infinity : 3);
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h4">
        BitNode-{props.n}: {bitNode.name}
      </Typography>
      <Typography variant="h5">{bitNode.desc}</Typography>
      <br />
      <Typography>
        Source-File Level: {props.level} / {maxSourceFileLevel}
      </Typography>
      <br />
      <Typography> Difficulty: {["easy", "normal", "hard"][bitNode.difficulty]}</Typography>
      <br />
      <br />
      <Typography component="div">{bitNode.info}</Typography>
      <BitnodeMultiplierDescription n={props.n} level={newLevel} />
      <br />
      <Button
        aria-label={`enter-bitnode-${bitNode.number.toString()}`}
        autoFocus={true}
        onClick={() => {
          enterBitNode(props.flume, props.destroyedBitNode, props.n);
          props.onClose();
        }}
      >
        Enter BN{props.n}.{newLevel}
      </Button>
    </Modal>
  );
}
