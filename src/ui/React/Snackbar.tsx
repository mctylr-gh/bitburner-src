import type { ToastVariant } from "@enums";

import React, { useEffect } from "react";
import { useSnackbar, SnackbarProvider as SB } from "notistack";
import { makeStyles } from "tss-react/mui";
import { EventEmitter } from "../../utils/EventEmitter";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { logBoxBaseZIndex } from "./Constants";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}
const useStyles = makeStyles()({
  snackbar: {
    // Log popup z-index increments, so let's add a padding to be well above them.
    zIndex: `${logBoxBaseZIndex + 1000} !important`,

    "& .MuiAlert-icon": {
      alignSelf: "center",
    },
  },
});

export function SnackbarProvider(props: IProps): React.ReactElement {
  const { classes } = useStyles();
  return (
    <SB
      dense
      maxSnack={9}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      autoHideDuration={2000}
      classes={{ containerRoot: classes.snackbar }}
    >
      {props.children}
    </SB>
  );
}

export const SnackbarEvents = new EventEmitter<[string | React.ReactNode, ToastVariant, number | null]>();

export function Snackbar({ hidden }: { hidden: boolean }): React.ReactElement {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (hidden) return;
    return SnackbarEvents.subscribe((s, variant, duration) => {
      const id = enqueueSnackbar(<Alert severity={variant}>{s}</Alert>, {
        content: (k, m) => <Paper key={k}>{m}</Paper>,
        variant: variant,
        autoHideDuration: duration,
        onClick: () => closeSnackbar(id),
      });
    });
  }, [closeSnackbar, enqueueSnackbar, hidden]);
  return <></>;
}
