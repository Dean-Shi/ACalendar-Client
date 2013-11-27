module("Keyboard Navigation 2011",{setup:function(){this.input=$('<input type="text" value="31-03-2011">').appendTo("#qunit-fixture").datepicker({format:"dd-mm-yyyy"}).focus(),this.dp=this.input.data("datepicker"),this.picker=this.dp.picker},teardown:function(){this.picker.remove()}}),test("Regression: by week (up/down arrows); up from Mar 6, 2011 should go to Feb 27, 2011",function(){var e;this.input.val("06-03-2011").datepicker("update"),equal(this.dp.viewMode,0),e=this.picker.find(".datepicker-days thead th.datepicker-switch"),equal(e.text(),"March 2011",'Title is "March 2011"'),datesEqual(this.dp.viewDate,UTCDate(2011,2,6)),datesEqual(this.dp.date,UTCDate(2011,2,6)),this.input.trigger({type:"keydown",keyCode:38}),datesEqual(this.dp.viewDate,UTCDate(2011,1,27)),datesEqual(this.dp.date,UTCDate(2011,1,27)),e=this.picker.find(".datepicker-days thead th.datepicker-switch"),equal(e.text(),"February 2011",'Title is "February 2011"')}),test("Regression: by day (left/right arrows); left from Mar 1, 2011 should go to Feb 28, 2011",function(){var e;this.input.val("01-03-2011").datepicker("update"),equal(this.dp.viewMode,0),e=this.picker.find(".datepicker-days thead th.datepicker-switch"),equal(e.text(),"March 2011",'Title is "March 2011"'),datesEqual(this.dp.viewDate,UTCDate(2011,2,1)),datesEqual(this.dp.date,UTCDate(2011,2,1)),this.input.trigger({type:"keydown",keyCode:37}),datesEqual(this.dp.viewDate,UTCDate(2011,1,28)),datesEqual(this.dp.date,UTCDate(2011,1,28)),e=this.picker.find(".datepicker-days thead th.datepicker-switch"),equal(e.text(),"February 2011",'Title is "February 2011"')}),test("Regression: by month (shift + left/right arrows); left from Mar 15, 2011 should go to Feb 15, 2011",function(){var e;this.input.val("15-03-2011").datepicker("update"),equal(this.dp.viewMode,0),e=this.picker.find(".datepicker-days thead th.datepicker-switch"),equal(e.text(),"March 2011",'Title is "March 2011"'),datesEqual(this.dp.viewDate,UTCDate(2011,2,15)),datesEqual(this.dp.date,UTCDate(2011,2,15)),this.input.trigger({type:"keydown",keyCode:37,shiftKey:!0}),datesEqual(this.dp.viewDate,UTCDate(2011,1,15)),datesEqual(this.dp.date,UTCDate(2011,1,15)),e=this.picker.find(".datepicker-days thead th.datepicker-switch"),equal(e.text(),"February 2011",'Title is "February 2011"')});