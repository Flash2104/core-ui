/**
 * Developer: Stepan Burguchev
 * Date: 6/14/2016
 * Copyright: 2009-2016 Comindware®
 *       All Rights Reserved
 * Published under the MIT license
 */

"use strict";

import core from 'coreApi';
import { initializeCore } from '../utils/helpers';
import 'jasmine-jquery';

describe('Editors', function () {
    beforeEach(function () {
        this.rootRegion = initializeCore();
    });

    describe('TextAreaEditorView', function () {
        let findInput = function (view) {
            return view.$('textarea');
        };

        it('should get focus when focus() is called', function () {
            // arrange
            let model = new Backbone.Model({
                data: 'text'
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);

            // act
            view.focus();

            // assert
            expect(findInput(view)).toBeFocused();
            expect(view.hasFocus).toEqual(true, 'Must have focus.');
        });

        it('should lose focus when blur() is called', function () {
            // arrange
            let model = new Backbone.Model({
                data: 'text'
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);
            view.focus();

            // act
            view.blur();

            // assert
            expect(findInput(view)).not.toBeFocused();
            expect(view.hasFocus).toEqual(false, 'Mustn\'t have focus.');
        });

        it('should have `value` matched with initial value', function () {
            // arrange
            let model = new Backbone.Model({
                data: 'text'
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);

            // act
            let value = view.getValue();

            // assert
            let expected = model.get('data');
            expect(findInput(view).val()).toEqual(expected);
            expect(value).toEqual(expected);
        });

        it('should have `value` matched with initial value (w/o data binding).', function () {
            // arrange
            let expected = 'text';
            let view = new core.form.editors.TextAreaEditor({
                value: expected
            });
            this.rootRegion.show(view);

            // act
            let value = view.getValue();

            // assert
            expect(findInput(view).val()).toEqual(expected);
            expect(value).toEqual(expected);
        });

        it('should update `value` and send `change` on user change.', function () {
            // arrange
            let expected = 'text 2';
            let model = new Backbone.Model({
                data: 'text'
            });
            let onChangeCallback = jasmine.createSpy('onChangeCallback');
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);
            view.on('change', onChangeCallback);

            // act
            view.focus();
            let input = findInput(view);
            input.val(expected);
            input.change();

            // assert
            expect(view.getValue()).toEqual(expected);
            expect(onChangeCallback).toHaveBeenCalledTimes(1);
        });

        it('should update `value` and send `change` on user change (w/o data binding).', function () {
            // arrange
            let expected = 'text 2';
            let onChangeCallback = jasmine.createSpy('onChangeCallback');
            let view = new core.form.editors.TextAreaEditor({
                value: 'text'
            });
            this.rootRegion.show(view);
            view.on('change', onChangeCallback);

            // act
            view.focus();
            let input = findInput(view);
            input.val(expected);
            input.change();

            // assert
            expect(view.getValue()).toEqual(expected);
            expect(onChangeCallback).toHaveBeenCalledTimes(1);
        });

        it('should update `value` on model change', function () {
            // arrange
            let onChangeCallback = jasmine.createSpy('onChangeCallback');
            let model = new Backbone.Model({
                data: 'text'
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);
            view.on('change', onChangeCallback);

            // act
            model.set('data', 'text 2');
            let value = view.getValue();

            // assert
            let expected = model.get('data');
            expect(findInput(view).val()).toEqual(expected);
            expect(value).toEqual(expected);
            expect(onChangeCallback).not.toHaveBeenCalled();
        });

        it('should not commit if `autocommit: false`', function () {
            // arrange
            let expected = 'text';
            let model = new Backbone.Model({
                data: expected
            });
            let onChangeCallback = jasmine.createSpy('onChangeCallback');
            let onCommitCallback = jasmine.createSpy('onCommitCallback');
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);
            view.on('change', onChangeCallback);
            view.on('value:committed', onCommitCallback);

            // act
            view.focus();
            let input = findInput(view);
            input.val('text 2');
            input.change();

            // assert
            expect(model.get('data')).toEqual(expected);
            expect(onChangeCallback).toHaveBeenCalledTimes(1);
            expect(onCommitCallback).not.toHaveBeenCalled();
        });

        it('should commit if `autocommit: true`', function () {
            // arrange
            let expected = 'text 2';
            let model = new Backbone.Model({
                data: 'text'
            });
            let onChangeCallback = jasmine.createSpy('onChangeCallback');
            let onCommitCallback = jasmine.createSpy('onCommitCallback');
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data',
                autocommit: true
            });
            this.rootRegion.show(view);
            view.on('change', onChangeCallback);
            view.on('value:committed', onCommitCallback);

            // act
            view.focus();
            let input = findInput(view);
            input.val(expected);
            input.change();

            // assert
            expect(model.get('data')).toEqual(expected);
            expect(onChangeCallback).toHaveBeenCalledTimes(1);
            expect(onCommitCallback).toHaveBeenCalledTimes(1);
        });

        it('should have `isEmptyValue() === true` if null or empty string', function () {
            // arrange
            let model = new Backbone.Model({
                data: null
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);

            // act
            let isEmpty = view.isEmptyValue();
            view.setValue('');
            let isEmptyIfEmptyString = view.isEmptyValue();

            // assert
            expect(isEmpty).toEqual(true);
            expect(isEmptyIfEmptyString).toEqual(true);
        });

        it('should have `isEmptyValue() === false` if has text', function () {
            // arrange
            let model = new Backbone.Model({
                data: 'text'
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data'
            });
            this.rootRegion.show(view);

            // act
            let isEmpty = view.isEmptyValue();

            // assert
            expect(isEmpty).toEqual(false);
        });

        it('should update `value` when typing if `changemode: \'keydown\'`', function () {
            // arrange
            let onChangeCallback = jasmine.createSpy('onChangeCallback');
            let model = new Backbone.Model({
                data: 'text'
            });
            let view = new core.form.editors.TextAreaEditor({
                model: model,
                key: 'data',
                changeMode: 'keydown'
            });
            this.rootRegion.show(view);
            view.on('change', onChangeCallback);

            // act
            view.focus();
            let input = findInput(view);
            input.val('text2');
            input.trigger('input');

            // assert
            expect(onChangeCallback).toHaveBeenCalledTimes(1);
        });
    });
});
