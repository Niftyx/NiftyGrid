$(function(){
    $.ajaxSetup({
        success: function(data){
            if(data.redirect){
                $.get(data.redirect);
            }
            if(data.snippets){
                for (var snippet in data.snippets){
                    $("#"+snippet).html(data.snippets[snippet]);
                }
            }
        }
    });

    $(document).on("click", ".grid-flash-hide", function(){
        $(this).parent().parent().fadeOut(300);
    });

    $(document).on("click", ".grid-select-all", function(){
        var checkboxes =  $(this).parents("thead").siblings("tbody").children("tr:not(.grid-subgrid-row)").find("td input:checkbox.grid-action-checkbox");
        if($(this).is(":checked")){
            $(checkboxes).attr("checked", "checked");
        }else{
            $(checkboxes).removeAttr("checked");
        }
    });

    $(document).on('click', '.grid a.grid-ajax:not(.grid-confirm)', function (event) {
        event.preventDefault();
        $.get(this.href);
    });

    $(document).on('click', '.grid a.grid-confirm:not(.grid-ajax)', function (event) {
        var answer = confirm($(this).data("grid-confirm"));
        return answer;
    });

    $(document).on('click', '.grid a.grid-confirm.grid-ajax', function (event) {
        event.preventDefault();
        var answer = confirm($(this).data("grid-confirm"));
        if(answer){
            $.get(this.href);
        }
    });

    $(document).on("click", ".grid-gridForm input[type=submit]", function(){
        $(this).addClass("grid-gridForm-clickedSubmit");
    });


    $(document).on("submit", ".grid-gridForm", function(event){
        var button = $(".grid-gridForm-clickedSubmit");
        $(button).removeClass("grid-gridForm-clickedSubmit");
        if($(button).data("select")){
            var selectName = $(button).data("select");
            var option = $("select[name=\""+selectName+"\"] option:selected");
            if($(option).data("grid-confirm")){
                var answer = confirm($(option).data("grid-confirm"));
                if(answer){
                    if($(option).hasClass("grid-ajax")){
                        event.preventDefault();
                        $.post(this.action, $(this).serialize()+"&"+$(button).attr("name")+"="+$(button).val());
                    }
                }else{
                    return false;
                }
            }else{
                if($(option).hasClass("grid-ajax")){
                    event.preventDefault();
                    $.post(this.action, $(this).serialize()+"&"+$(button).attr("name")+"="+$(button).val());
                }
            }
        }else{
            event.preventDefault();
            $.post(this.action, $(this).serialize()+"&"+$(button).attr("name")+"="+$(button).val());
        }
    });

    $(document).on('keydown.autocomplete', ".grid-autocomplete", function(){
        var gridName = $(this).data("gridname");
        var column = $(this).data("column");
        var link = $(this).data("link");
        $(this).autocomplete({
            source: function(request, response) {
                $.ajax({
                    url: link,
                    data: gridName+'-term='+request.term+'&'+gridName+'-column='+column,
                    dataType: "json",
                    method: "post",
                    success: function(data) {
                        response(data.payload);
                    }
                });
            },
            delay: 100,
            open: function() { $('.ui-menu').width($(this).width()) }
        });
    });

    $(document).on("change", ".grid-changeperpage", function(){
        $.get($(this).data("link"), $(this).data("gridname")+"-perPage="+$(this).val());
    });

    function hidePerPageSubmit()
    {
        $(".grid-perpagesubmit").hide();
    }
    hidePerPageSubmit();

    function setDatepicker()
    {
        if ( ! $.datepicker ) return;

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
            yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional['cs']);

        $(".grid-datepicker").each(function(){
            if(($(this).val() != "")){
                var date = $.datepicker.formatDate('yy-mm-dd', new Date($(this).val()));
            }
            $(this).datepicker();
            $(this).datepicker({ constrainInput: false});
        });
    }
    setDatepicker();

    $(this).ajaxStop(function(){
        setDatepicker();
        hidePerPageSubmit();
    });

    $(document).on("keypress", "input.grid-editable", function(e) {
        if (e.keyCode == '13') {
            e.preventDefault();
            $("input[type=submit].grid-editable").click();
        }
    });

    $(document).on("dblclick", "table.grid tbody tr:not(.grid-subgrid-row) td.grid-data-cell", function(e) {
        $(this).parent().find("a.grid-editable:first").click();
    });
});