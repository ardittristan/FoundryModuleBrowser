//@replaceStart
import '../Typedefs';
//@replaceEnd
import React from 'react';
import ReactDOM from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import App from './react/ModuleApp';
import theme from './react/theme';

import './index.css';

globalThis.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


ReactDOM.render(
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <App />
        </ThemeProvider>
        , document.querySelector("#root")
    );
