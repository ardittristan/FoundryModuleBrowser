//@replaceStart
import '../Typedefs';
//@replaceEnd
import React from 'react';

import clsx from 'clsx';
import { getByTag } from 'locale-codes';
import Measure from 'react-measure';


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TranslateIcon from '@material-ui/icons/Translate';
import ContentCopyIcon from 'mdi-material-ui/ContentCopy';
import DownloadIcon from '@material-ui/icons/GetApp';


const collapsedHeight = 72;

(new MutationObserver((mutationList, observer) => {
    mutationList.forEach(mutation => {
        if (mutation.addedNodes.length !== 0) {
            if (mutation.addedNodes[0]?.firstChild?.firstChild?.className === "updateTooltip") {
                let searchedElement = document.querySelector(".idTooltip")?.parentElement?.parentElement
                if (searchedElement) {
                    searchedElement.style.display = "none"
                }
            }
        }
        if (mutation.removedNodes.length !== 0) {
            if (mutation.removedNodes[0]?.firstChild?.firstChild?.className === "updateTooltip") {
                let searchedElement = document.querySelector(".idTooltip")?.parentElement?.parentElement
                if (searchedElement) {
                    searchedElement.style.display = "unset"
                }
            }
        }
    })
})).observe(document.body, {childList: true})

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    textheight: {
        fontSize: '1.02rem'
    },
    padChip: {
        padding: '0.4em'
    },
    smallCardActions: {
        paddingTop: 0,
        paddingBottom: 0
    },
    noCardHeaderBottom: {
        paddingBottom: 0
    },
    buttonMargin: {
        marginRight: "4px",
        marginLeft: "4px"
    },
}));

const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}

function CollapsableInfoBox(props) {
    const classes = useStyles();
    const module = props.module;

    const [expanded, setExpanded] = React.useState(false);
    const [expandable, setExpandable] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleExpandable = (height) => {
        if (typeof height === "object") {return}
        if (height > collapsedHeight) {
            setExpandable(true);
        } else {
            setExpandable(false);
        }
    };

    const handleExpandVisibility = () => {
        if (expandable) {
            return "expandable";
        } else {
            return "noExpand";
        }
    };

    window.addEventListener('resize', handleExpandable);


    return (
        <Collapse
            in={expanded}
            timeout="auto"
            collapsedHeight={`${collapsedHeight}px`}
        >
            <Grid container spacing={3}>
                {// text container
                }
                <Grid container item xs>
                    <Measure bounds onResize={contentRect => handleExpandable(contentRect.bounds.height)}>
                        {({ measureRef }) => (
                            <Typography
                                ref={measureRef}
                                className={classes.textheight}
                                variant="body1"
                                component="p"
                                color="textPrimary"
                            >
                                {stripHtml(module.description)}
                            </Typography>
                        )}
                    </Measure>
                </Grid>
                {// expand button
                }
                <Grid item >
                    <IconButton
                        className={
                            clsx(classes.expand, {
                                [classes.expandOpen]: expanded
                            }) +
                            " " +
                            handleExpandVisibility()
                        }
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        size="small"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Collapse>
    );
}

export default function ModuleCard(props) {
    const classes = useStyles();
    /** @type {Type.Module} */
    const module = props.module;
    const [copyOpen, setCopyOpen] = React.useState(false);



    const handleCopyButton = () => {
        copyToClipboard(module.manifest);
        setCopyOpen(true);
    };

    const handleCopyClose = () => {
        setCopyOpen(false);
    };

    const copyToClipboard = (text) => {
        const listener = function (ev) {
            ev.preventDefault();
            ev.clipboardData.setData('text/plain', text);
        };
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
    };

    return (
        <Card>
            <CardHeader
                className={classes.noCardHeaderBottom}
                title={
                    <Tooltip arrow title={<div className="idTooltip">{"id: " + module.name}</div>}>
                        <Typography variant="h5" component="span" display="inline">
                            {module.title}
                            <BootstrapTooltip placement="top" title={<div className="updateTooltip">{`Updated ${module.lastUpdate}`}</div>}>
                                <Typography variant="subtitle2" color="textSecondary" display="inline" style={{ verticalAlign: "top" }}>
                                    {String.fromCharCode(160) + `-v ${module.version}`}
                                </Typography>
                            </BootstrapTooltip>
                        </Typography>
                    </Tooltip>
                }
                subheader={
                    <Grid container>
                        <Typography
                            variant="subtitle2"
                            component="span"
                        >
                            {(module.authors !== undefined && module.authors.length !== 0 && module.authors[0].name.length !== 0) &&
                                <Grid container>
                                    {
                                        module.authors.map((x, i) => (
                                            <div key={i}>
                                                {x.url &&
                                                    <Grid container>
                                                        <a href={x.url} target="_blank">
                                                            {x.name}
                                                        </a>
                                                        {i !== module.authors.length - 1 &&
                                                            <div>,{String.fromCharCode(160)}</div>
                                                        }
                                                    </Grid>
                                                }
                                                {!x.url &&
                                                    <Grid container>
                                                        {x.name}
                                                        {i !== module.authors.length - 1 &&
                                                            <div>,{String.fromCharCode(160)}</div>
                                                        }
                                                    </Grid>
                                                }
                                            </div>
                                        ))
                                    }
                                </Grid>
                            }
                            {(module.authors === undefined || module.authors.length === 0 || module.authors[0].name.length === 0) &&
                                `${module.author}`.replace(/\,/g, ", ")
                            }
                        </Typography>
                    </Grid>
                }
            />

            <CardContent>
                <CollapsableInfoBox module={module} />
            </CardContent>
            <Divider />
            <CardActions className={classes.smallCardActions}>
                <Grid container spacing={1} className={classes.padChip}>
                    {(module.languages !== undefined && module.languages.length !== 0) &&
                        module.languages.map((language, i) => (
                            <Grid key={i} item>
                                <Chip
                                    size="small"
                                    icon={
                                        <Tooltip arrow title="Language">
                                            <TranslateIcon />
                                        </Tooltip>
                                    }
                                    label={
                                        getByTag(language.lang)?.local || getByTag(language.lang)?.name || language.name || language.lang
                                    }
                                />
                            </Grid>
                        ))
                    }
                    {(module.languages === undefined || module.languages.length === 0) &&
                        <Grid item>
                            <Chip
                                size="small"
                                icon={
                                    <Tooltip arrow title="Language">
                                        <TranslateIcon />
                                    </Tooltip>
                                }
                                label="Not Specified"
                            />
                        </Grid>
                    }
                </Grid>
            </CardActions>
            <Divider />
            <CardActions disableSpacing={true}>
                <Grid container direction="row" justify="space-between">
                    <Grid>
                        <Button
                            href={`https://foundryvtt.com${module.foundryUrl}`}
                            target="_blank"
                            size="small"
                            color="primary"
                            className={classes.buttonMargin}
                        >
                            Foundry Page
                            </Button>
                        {module.url &&
                            <Button
                                href={module.url}
                                target="_blank"
                                size="small"
                                color="primary"
                                className={classes.buttonMargin}
                            >
                                Info Page
                                </Button>
                        }
                    </Grid>
                    <Grid>
                        <IconButton
                            size="small"
                            className={classes.buttonMargin}
                            onClick={handleCopyButton}
                        >
                            <Tooltip arrow title="Copy manifest url">
                                <ContentCopyIcon style={{ fontSize: 24 }} />
                            </Tooltip>
                        </IconButton>
                        <Snackbar open={copyOpen} autoHideDuration={3000} onClose={handleCopyClose}>
                            <Alert onClose={handleCopyClose} severity="info">
                                Copied url to clipboard!
                                </Alert>
                        </Snackbar>
                        <IconButton
                            href={module.download}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={true}
                            size="small"
                            className={classes.buttonMargin}
                        >
                            <Tooltip arrow title="Download module">
                                <DownloadIcon style={{ fontSize: 24 }} />
                            </Tooltip>
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}


/**
 * Returns the text from a HTML string
 * @param {html} String
 */
function stripHtml(html) {
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}
