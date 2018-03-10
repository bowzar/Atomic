define(["jquery", "vue", "lodash", "pages"], function ($, Vue, _, pages) {
    'use strict';

    pages = pages.where(function (item) {
        return item.props.isMain && item.name == "Example";
    })[0].children;

    var vm = new Vue({
        el: "#body-main-navigator",
        data: {
            isBusy: true,
            selectedItem: "",
            examples: [],
            groups: [],
            searchKey: "",
            inputKey: "",
        },
        watch: {
            searchKey: function (key) {
                this.inputKey = key.trim().toLowerCase();
                // this.search();
            }
        },

        methods: {
            init: function (callback) {

                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].props.isVisible == undefined)
                        pages[i].props.isVisible = true;
                    else if (!pages[i].props.isVisible)
                        pages[i].props.isVisible = false;
                }

                this.examples = pages;

                var gp = _.groupBy(this.examples, function (item) {
                    return item.props.gallery;
                });

                for (var key in gp) {
                    this.groups.push({ key: key, value: gp[key] });
                }

                setTimeout(function () {
                    vm.isBusy = false;
                    callback();
                }, 100);
            },

            select: function (item) {
                if (!item)
                    return;

                this.selectedItem = item.name;
            },

            search: _.debounce(function () {

                var key = this.searchKey;
                console.log(key);

                for (var i = 0; i < this.groups.length; i++) {
                    var gp = this.groups[i];

                    gp.value = gp.value.filter(function (item) {
                        item.props.isVisible = key.length == 0 ?
                            true : item.name.toLowerCase().indexOf(key) >= 0;
                    });
                }

            }, 500),

            searchFilter: function (values) {

                var key = this.inputKey;
                return values.filter(function (item) {
                    return key.length == 0 ? true : item.name.toLowerCase().indexOf(key) >= 0;
                });
            },

            countFilter: function (values) {

                var result = this.searchFilter(values);
                return result.length == values.length ? values.length : result.length + "/" + values.length;
            }
        }
    });

    return vm;
});