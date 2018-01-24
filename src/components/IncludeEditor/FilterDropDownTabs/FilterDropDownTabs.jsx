import React, { Component } from 'react';
import map from 'lodash/map';
import cn from 'classnames';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';

export default class SearchTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      activeItems: this.props.value || [],
      showDropDown: false,
      cat: [],
    };
  }

  componentWillMount() {
    const { categories } = this.props;
    const data = {};

    categories.forEach(item => {
      if (!item.parentId) {
        data[item["id"]] = [];
        data[item["id"]].push(item);
      }
    });

    categories.forEach(item => {
      if (item.parentId && data[item.parentId]) {
        data[item.parentId].push(item);
      }
    });

    this.setState({ data, cat: categories });
  }

  componentDidMount() {
    document.addEventListener("click", this.clickOutside.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.clickOutside.bind(this), false);
  }

  clickOutside(ev) {
    if (
      this.block &&
      !this.block.contains(ev.target) &&
      !ev.target.classList.contains("js-show-popup")
    ) {
      this.setState({ showDropDown: false });
    }
  }

  showDropDown = ev => {
    ev.preventDefault();
    ev.stopPropagation();

    this.setState({ showDropDown: !this.state.showDropDown });
  };

  setFilterCategory(activeItems) {
    const { changeSendingState, id, type, title, value } = this.props;

    this.setState({ activeItems });

    changeSendingState({
      [id]: { id, type, title, value: activeItems },
    });
  }

  filterCategoty(item) {
    const { data } = this.state;
    const parent = data[item.id].filter(item => item.parentId);
    const childs = parent.map(item => item.id);
    let activeItems = [...this.state.activeItems];
    let res = activeItems.filter(ch => childs.indexOf(ch) > -1);

    if (res.length == childs.length) {
      remove(activeItems, active => childs.indexOf(active) > -1);
    } else {
      activeItems.push(...childs);
    }

    this.setFilterCategory(uniq(activeItems));
  }

  filterColumn(item) {
    let activeItems = [...this.state.activeItems];

    if (this.props.fieldType != 'single-category') {
      if (activeItems.indexOf(item.id) > -1) {
        remove(activeItems, active => active == item.id);
      } else {
        activeItems.push(item.id);
      }
    } else {
      activeItems = [item.id];
    }

    this.setFilterCategory(uniq(activeItems));
  }

  removeCategory(id) {
    const { activeItems } = this.state;

    this.setFilterCategory(activeItems.filter(item => item !== id));
  }

  renderButtonCategory = (item) => {
    const { cat } = this.state;

    const title = cat.find(category => category.id == item);

    return (
      <div key={item} className="button-category w-clearfix">
        <div className="button-category-text">{title ? title.name : ''}</div>
        <div
          className="button-category-close admin"
          onClick={this.removeCategory.bind(this, item)}
        />
      </div>
    );
  };

  render() {
    const { data, showDropDown, activeItems } = this.state;

    return (
      <div className="clearfix" style={{ position: 'relative' }}>
        <label className="field-label" htmlFor="name-2">
          КАТЕГОРИЯ
        </label>
        <div
          className="add-category button-category w-clearfix js-show-popup"
          onClick={this.showDropDown}
        >
          <div className="button-category-add js-show-popup" />
          <div className="button-category-text-add js-show-popup">добавить</div>
        </div>
        {!!activeItems &&
          activeItems.map(item => this.renderButtonCategory(item))}
        {showDropDown && (
          <div
            style={{ position: "absolute", left: 0, top: 85 }}
            ref={block => {
              this.block = block;
            }}
            className="dropdown_block"
          >
            <div className="filter_catalog_block w-clearfix">
              {map(data, (category, key) => (
                <div key={key} className="catalog_column">
                  {category.map((item, key) => {
                    if (key === 0) {
                      return (
                        <h4
                          key={key}
                          onClick={() => {
                            this.props.fieldType !== 'single-category' &&
                              this.filterCategoty(item);
                          }}
                          className="header_popup_category_filter"
                        >
                          {item.name}
                        </h4>
                      );
                    }

                    return (
                      <div
                        onClick={this.filterColumn.bind(this, item)}
                        key={key}
                        className={cn(
                          "text_popup_filter_category",
                          activeItems.indexOf(item.id) > -1 ? "active" : "1"
                        )}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
