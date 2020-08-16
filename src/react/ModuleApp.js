//@replaceStart
import '../Typedefs';
//@replaceEnd
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment-timezone';
import LazyLoad from '@frontity/lazyload';
import Measure from 'react-measure';
import { getByTag } from 'locale-codes';
import FilterMaterialUi, { TYPE } from 'filter-material-ui';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TranslateIcon from '@material-ui/icons/Translate';
import FeatherIcon from 'mdi-material-ui/Feather';
import FilterList from '@material-ui/icons/FilterList';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import '@material-ui/core/Paper';

import ModuleCard from './ModuleCard';


/**
 * @typedef UseStyles
 * @type {object}
 * @property {string} gridPadding
 */
const useStyles = (theme) => ({
    gridPadding: {
        padding: `${0.5 * 8}px`
    }
});

globalThis.languages = [];

globalThis.authors = [];

globalThis.systems = ["all"];

let filterTextPlaceholder = {
    all: "",
    singular: "",
    plural: ""
};

let filters = [
    {
        label: "Languages",
        name: "languages",
        options: languages,
        text: filterTextPlaceholder,
        type: TYPE.MULTIPLE_SELECT
    },
    {
        label: "Author",
        name: "author",
        options: authors,
        text: filterTextPlaceholder,
        type: TYPE.SINGLE_SELECT
    },
    {
        label: "Systems",
        name: "systems",
        options: systems,
        text: filterTextPlaceholder,
        type: TYPE.SINGLE_SELECT
    }
];


class FilterWrapper extends React.Component {
    constructor(props) {
        super();
        /** @type {Type.Module} */
        this.module = props.module;

        this.getName = this.getName.bind(this);
        this.getLanguages = this.getLanguages.bind(this);
        this.getAuthors = this.getAuthors.bind(this);
        this.getSystems = this.getSystems.bind(this);
    }
    shouldComponentUpdate() { return false; }

    getName() { return this.module.name; }

    getLanguages() {
        if (this.module?.languages) {
            let languageArray = [];
            this.module.languages.forEach(language => {
                if (language.lang) {
                    const local = getByTag(language.lang)?.local;
                    const name = getByTag(language.lang)?.name;
                    if (!languages.includes(local) && !languages.includes(name) && (local || name)) {
                        languages.push(local || name);
                        languages = sort(languages);
                    }
                    if (local || name) {
                        languageArray.push(local || name);
                    }
                }
            });
            return languageArray.toString();
        }
    }

    getAuthors() {
        let authorList = [];
        let moduleAuthors = [];
        if (this.module.authors !== undefined && this.module.authors.length !== 0 && this.module.authors[0].name.length !== 0) {
            moduleAuthors = this.module.authors;
        }
        else if ((this.module.authors === undefined || this.module.authors.length === 0 || this.module.authors[0].name.length === 0) && typeof this.module.author === "string") {
            moduleAuthors = this.module.author.split(",").map(author => { return { name: author }; });
        }
        moduleAuthors.forEach(author => {
            /** @type {String} */
            let name = author.name;
            name = name
                .replace(/module:/i, "")
                .replace(/.*list:/i, "")
                .replace(/\(.*\)/, "")
                .replace(/\<.*\>/, "")
                .replace(/\[.*\]/, "")
                .replace(/\- .*/, "")
                .trim();
            if (!authors.includes(name)) {
                authors.push(name);
                authors = sort(authors);
            }
            authorList.push(name);
        });
        return authorList.toString();
    }

    getSystems() {
        if (this.module.systems) {
            if (typeof this.module.systems === "object" && this.module.systems.length !== 0) {
                let systemList = [];
                this.module.systems.forEach(system => {
                    if (!systems.includes(system)) {
                        systems.push(system);
                        systems = sort(systems);
                    }
                    systemList.push(system);
                });
                return systemList.toString();
            }
            else if (typeof this.module.systems === "string" && this.module.systems.length !== 0) {
                if (!systems.includes(this.module.systems)) {
                    systems.push(this.module.systems);
                    systems = sort(systems);
                }
                return this.module.systems;
            } else {
                return "All";
            }
        }
        return "All";
    }

    render() {
        return (
            <Grid xs={12} sm={6} md={4} lg={2} xl={1} item style={{ minHeight: "256.188px", display: "block" }} className="ModuleCard"
                data-name={this.getName()}
                data-languages={this.getLanguages()}
                data-authors={this.getAuthors()}
                data-systems={this.getSystems()}
            >
                <LazyLoad async={true} offset={500} throttle={200}>
                    <ModuleCard module={this.props.module} />
                </LazyLoad>
            </Grid>
        );
    }
}


class App extends React.Component {
    constructor() {
        super();

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.filterCards = this.filterCards.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = { searchValue: "", modules: [], updated: "", filters: {} };

        this.searchValue = "";
        this.filters = {};

    }

    /* -------------< Search Bar >---------------- */

    /**
     * @param  {React.SyntheticEvent} event
     */
    handleSearchChange(event) {
        this.setState({ ...this.state, ...{ searchValue: event.target.value } });
        this.searchValue = event.target.value;

        this.filterCards();
        window.dispatchEvent(new Event('resize'));
    }

    componentDidMount() {
        fetch('https://raw.githubusercontent.com/ardittristan/FoundryAPI/api/modules.json')
            .then(res => res.json()
                .then(json => {
                    this.setState({
                        ...this.state, ...{
                            modules: json.modules,
                            updated: moment(json.updated).tz(timeZone).format("H:mm")
                        }
                    });
                }));
    }


    filterCards() {
        document.querySelectorAll(".ModuleCard").forEach(
            /** @param {HTMLElement} element */
            (element) => {
                if (this.searchValue.length === 0 && this.filters.length === 0 && element.style.display === "none") {
                    element.style.display = "block";
                } else {
                    let show = true;

                    if (this.filters?.author) {

                        if (!ciIncludes(element.dataset.authors, this.filters.author)) {
                            show = false;
                        }
                    }

                    if (this.filters?.systems) {
                        if (!ciIncludes(element.dataset.systems, this.filters?.systems)) {
                            show = false;
                        }
                    }

                    if (this.filters?.languages && this.filters.languages.length !== 0) {
                        if (element.dataset.languages) {
                            this.filters.languages.forEach(language => {
                                if (!ciIncludes(element.dataset.languages, language)) {
                                    show = false;
                                }
                            });
                        } else {
                            show = false;
                        }
                    }

                    if (!ciIncludes(element.dataset.name, this.searchValue)) {
                        show = false;
                    }


                    if (show && element.style.display === "none") {
                        element.style.display = "block";
                    } else if (!show && element.style.display === "block") {
                        element.style.display = "none";
                    }
                }
            });
    }

    handleChange(filters) {
        this.setState({
            ...this.state, ...{
                filters: filters
            }
        });
        this.filters = filters;
        this.filterCards();
        window.dispatchEvent(new Event('resize'));
    }

    handleFilterOpen() {
        let icon = document.querySelector('.filterBar > div > div > div > svg')?.parentElement;
        if (icon) { icon.innerHTML = ReactDOMServer.renderToStaticMarkup(<FilterList style={{ fill: "rgb(63, 81, 181)", fontSize: "1em" }} />); }

        document.querySelectorAll('.filterBar > div > div > span').forEach(element => {
            let textContent = element?.textContent;

            if (textContent) {
                textContent = textContent.replace(/, and/g, "").trim();
                /** @type {String[]} */
                let chips = textContent.split("'").map(Function.prototype.call, String.prototype.trim).filter(entry => !(entry.length === 0 || entry === ","));
                if (chips.length !== 0) {
                    let chipHTML = "";
                    chips.forEach(chipContent => {
                        if (languages.includes(chipContent.trim())) {
                            chipHTML += ReactDOMServer.renderToStaticMarkup(
                                <div className="MuiChip-root MuiChip-sizeSmall chipFilterIcon">
                                    <TranslateIcon className="MuiChip-iconSmall MuiChip-icon" />
                                    <span className="MuiChip-label MuiChip-labelSmall">{chipContent.trim()}</span>
                                </div>
                            );
                        }
                        else if (authors.includes(chipContent.trim())) {
                            chipHTML += ReactDOMServer.renderToStaticMarkup(
                                <div className="MuiChip-root MuiChip-sizeSmall chipFilterIcon">
                                    <FeatherIcon className="MuiChip-iconSmall MuiChip-icon" />
                                    <span className="MuiChip-label MuiChip-labelSmall">{chipContent.trim()}</span>
                                </div>
                            );
                        }
                        else if (systems.includes(chipContent.trim())) {
                            chipHTML += ReactDOMServer.renderToStaticMarkup(
                                <div className="MuiChip-root MuiChip-sizeSmall chipFilterIcon">
                                    <LocalLibrary className="MuiChip-iconSmall MuiChip-icon" />
                                    <span className="MuiChip-label MuiChip-labelSmall">{chipContent.trim()}</span>
                                </div>
                            );
                        }

                        else {
                            chipHTML += ReactDOMServer.renderToStaticMarkup(
                                <div className="MuiChip-root MuiChip-sizeSmall chipFilterIcon">
                                    <span className="MuiChip-label MuiChip-labelSmall">{chipContent.trim()}</span>
                                </div>
                            );
                        }
                    });
                    chipHTML = `<div class="MuiPaper-root MuiPaper-rounded MuiPaper-elevation1 FilterPaper">${chipHTML}</div>`;
                    element.innerHTML = chipHTML;
                } else {
                    element.innerHTML = null;
                }
            }
        });
    }










    render() {
        /** @type {{classes: UseStyles}} */
        const { classes } = this.props;

        return (
            <div id="ModuleCards">
                <Grid container direction="column" className={classes.gridPadding}>
                    <Grid className={classes.gridPadding}>
                        {/* search field */}
                        <TextField

                            fullWidth={true}
                            id="outlined-basic"
                            label="Search"
                            value={this.state.searchValue}
                            variant="outlined"
                            onChange={this.handleSearchChange}
                        />
                        <Measure bounds onResize={() => this.handleFilterOpen()} >
                            {({ measureRef }) => (
                                <div ref={measureRef} className="filterBar">
                                    <FilterMaterialUi
                                        textPrefix=""
                                        textSuffix=""
                                        data={this.state.filters}
                                        fields={filters}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            )}
                        </Measure>
                    </Grid>
                    <Grid container direction="row" item xs spacing={2} className={classes.gridPadding + " bigContainer"}>
                        {this.state.modules.map((module, i) => (
                            <FilterWrapper key={module.name} module={module} />
                        ))}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

/**
 * @param  {String} value string to search in
 * @param  {String} query what is included
 */
function ciIncludes(value, query) {
    if (query.length === 0) { return true; }
    return value.toLowerCase().includes(query.toLowerCase());
}

/**
 * @param  {String[]} array
 */
function sort(array) {
    /** @type {String[]} */
    let out;
    try {
        out = array.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } catch {
        return array;
    }
    return out;
}


export default withStyles(useStyles)(App);
