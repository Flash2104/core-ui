//@flow
import IconButtonView from './impl/iconEditor/views/IconButtonView';
import IconPanelView from './impl/iconEditor/views/IconPanelView';
import template from './impl/iconEditor/templates/iconEditorComponentView.html';
import iconPalette from './impl/iconEditor/iconPalette';
import BaseLayoutEditorView from './base/BaseLayoutEditorView';

const constants = {
    iconPropertyDefaultName: 'iconClass'
};

/*
 * options parameters:
 *
 * @param model
 * @param modelIconProperty - name of model property. 'iconClass' as default
 */

export default BaseLayoutEditorView.extend({
    initialize(options) {
        const modelIconProperty = options.modelIconProperty;
        if (modelIconProperty && modelIconProperty !== constants.iconPropertyDefaultName) {
            this.model.set('iconClass', this.model.get(options.modelIconProperty));
        }
    },

    template: Handlebars.compile(template),

    className: 'icon-editor-wrp',

    regions: {
        iconSelectorHeaderRegion: '.js-icon-selector-header'
    },

    ui: {
        deleteIconButton: '.js-delete-icon'
    },

    events: {
        'click @ui.deleteIconButton': '__onDeleteIconClick'
    },

    onRender() {
        this.popupPanel = Core.dropdown.factory.createPopout({
            buttonView: IconButtonView,
            panelView: IconPanelView,
            buttonViewOptions: {
                model: this.model
            },
            panelViewOptions: {
                collection: this.__getConfig(),
                model: new Backbone.Model({
                    searchKey: ''
                })
            },
            customAnchor: true
        });

        this.popupPanel.on('panel:click:item', id => {
            this.ui.deleteIconButton.show();
            this.model.set('iconClass', id);
            this.trigger('click:item', id);
            this.close();
        });

        this.showChildView('iconSelectorHeaderRegion', this.popupPanel);
        if (!this.model.get('iconClass')) {
            this.ui.deleteIconButton.hide();
        }
    },

    __getConfig() {
        const groupItems = [];
        const groupItemsObj = this.__groupIcon();
        const groupItemsNames = Object.keys(groupItemsObj);
        _.each(groupItemsNames, item => {
            groupItems.push({
                name: item,
                groupItems: groupItemsObj[item]
            });
        });
        return new Backbone.Collection(groupItems);
    },

    __onDeleteIconClick() {
        this.model.set('iconClass', null);
        this.trigger('click:item', null);
        this.ui.deleteIconButton.hide();
        this.popupPanel.render();
    },

    open() {
        this.popupPanel.open();
    },

    close() {
        this.popupPanel.close();
    },

    __groupIcon() {
        const groupItemsObj = {};
        _.each(iconPalette, item => {
            _.each(item.categories, categoryItem => {
                if (!groupItemsObj[categoryItem]) {
                    groupItemsObj[categoryItem] = [];
                }
                groupItemsObj[categoryItem].push(item);
            });
        });
        return groupItemsObj;
    }
});
