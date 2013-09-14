(function (undefined) {
    function niftyGridInitialize() {
        if (!$.datepicker) return;

        $.datepicker.regional['cs'] = {
            closeText: 'Zavřít',
            prevText: '&#x3c;Dříve',
            nextText: 'Později&#x3e;',
            currentText: 'Nyní',
            monthNames: ['leden','únor','březen','duben','květen','červen',
                'červenec','srpen','září','říjen','listopad','prosinec'],
            monthNamesShort: ['led','úno','bře','dub','kvě','čer',
                'čvc','srp','zář','říj','lis','pro'],
            dayNames: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
            dayNamesShort: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
            dayNamesMin: ['ne','po','út','st','čt','pá','so'],
            weekHeader: 'Týd',
            dateFormat: 'yy-mm-dd',
            constrainInput: false,
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional['cs']);
    }

    function niftyGrid(ajax) {
        $('.grid-flash-hide').off('click.niftygrid').on('click.niftygrid', function () {
            $(this).parent().parent().fadeOut(300);
        });

        $('.grid-select-all').off('click.niftygrid').on('click.niftygrid', function () {
            var checkboxes = $(this).parents('thead').siblings('tbody').children('tr:not(.grid-subgrid-row)').find('td input:checkbox.grid-action-checkbox');
            if ($(this).is(':checked')) {
                checkboxes.attr('checked', 'checked');
            } else {
                checkboxes.removeAttr('checked');
            }
        });

        $('.grid a.grid-ajax:not(.grid-confirm)').off('click.niftygrid').on('click.niftygrid', function (e) {
            ajax({}, this, e);
        });

        $('.grid a.grid-confirm:not(.grid-ajax)').off('click.niftygrid').on('click.niftygrid', function () {
            return confirm($(this).data('grid-confirm'));
        });

        $('.grid a.grid-confirm.grid-ajax').off('click.niftygrid').on('click.niftygrid', function (e) {
            e.preventDefault();
            var answer = confirm($(this).data('grid-confirm'));
            if (answer) {
                ajax({}, this, e);
            }
        });

        $('.grid-gridForm').find('input[type=submit]').off('click.niftygrid').on('click.niftygrid', function () {
            $(this).addClass('grid-gridForm-clickedSubmit');
        });

        $('.grid-gridForm').off('submit.niftygrid').on('submit.niftygrid', function (e) {
            var button = $(this).find('.grid-gridForm-clickedSubmit');
            button.removeClass('grid-gridForm-clickedSubmit');
            if (button.data('select')) {
                var selectName = button.data('select');
                var option = $('select[name="' + selectName + '"] option:selected');
                var answer = option.data("grid-confirm");
                if (answer) {
                    if (confirm(answer)) {
                        if (option.hasClass('grid-ajax')) {
                            ajax({}, this, e);
                        }
                    } else {
                        return false;
                    }
                } else {
                    if (option.hasClass('grid-ajax')) {
                        ajax({}, this, e);
                    }
                }
            } else {
                ajax({}, this, e);
            }
        });

        $('.grid-autocomplete').off('keydown.autocomplete').on('keydown.autocomplete', function () {
            var autocomplete = $(this);
            var gridName = autocomplete.data('gridname');
            var column = autocomplete.data('column');
            var link = autocomplete.data('link');
            autocomplete.autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: link,
                        data: gridName + '-term=' + request.term + '&' + gridName + '-column=' + column,
                        dataType: 'json',
                        method: 'post'
                    }).done(function(data) {
                        response(data.payload);
                    });
                },
                delay: 100,
                open: function() {
                    $('.ui-menu').width($(this).width());
                }
            });
        });

        $('.grid-changeperpage').off('change.niftygrid').on('change.niftygrid', function () {
            ajax({
                type: 'get',
                url: $(this).data('link'),
                data: $(this).data('gridname') + '-perPage=' + $(this).val()
            });
        });

        $('.grid-perpagesubmit').hide();

        if ($.datepicker) {
            $('.grid-datepicker').each(function () {
                if ($(this).val() != '') {
                    var date = $.datepicker.formatDate('yy-mm-dd', new Date($(this).val()));
                }
                $(this).datepicker();
                $(this).datepicker({
                    constrainInput: false
                });
            });
        }

        $('input.grid-editable').off('keypress.niftygrid').on('keypress.niftygrid', function (e) {
            if (e.keyCode == '13') {
                e.preventDefault();
                $('input[type=submit].grid-editable').click();
            }
        });

        $('table.grid tbody tr:not(.grid-subgrid-row) td.grid-data-cell').off('dblclick.niftygrid').on('dblclick.niftygrid', function (e) {
            $(this).parent().find('a.grid-editable:first').click();
        });
    }

    if (typeof $.nette.ajax !== 'undefined') {
        $.nette.ajax('niftyGrid', {
            init: niftyGridInitialize,
            load: function () {
                niftyGrid($.nette.ajax);
            }
        });
    } else {
        function ajax(params, ui, e) {
            e.preventDefault();
            if ($(ui).is('form')) {
                var button = $(ui).find('.grid-gridForm-clickedSubmit');
                params.url = ui.action;
                params.type = 'post';
                params.data = $(ui).serialize() + '&' + button.attr('name') + '=' + button.val();
            } else {
                params.url = ui.href;
                params.type = 'get';
            }
            return $.ajax(params).done(function () {
                if (data.redirect) {
                    $.get(data.redirect);
                }
                if (data.snippets) {
                    for (var snippet in data.snippets) {
                        $('#' + snippet).html(data.snippets[snippet]);
                    }
                }
                niftyGrid(ajax);
            });
        };

        niftyGridInitialize();
        $(function () {
            niftyGrid(ajax);
        });
    }
})();
