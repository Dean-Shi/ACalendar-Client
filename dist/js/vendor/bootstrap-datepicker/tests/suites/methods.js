module("Methods",{setup:function(){this.input=$('<input type="text" value="31-03-2011">').appendTo("#qunit-fixture").datepicker({format:"dd-mm-yyyy"}),this.dp=this.input.data("datepicker")},teardown:function(){this.dp.remove()}}),test("update - String",function(){this.dp.update("13-03-2012"),datesEqual(this.dp.date,UTCDate(2012,2,13));var e=this.dp.picker.find(".datepicker-days td:contains(13)");ok(e.is(".active"),"Date is selected")}),test("update - Date",function(){this.dp.update(new Date(2012,2,13)),datesEqual(this.dp.date,UTCDate(2012,2,13));var e=this.dp.picker.find(".datepicker-days td:contains(13)");ok(e.is(".active"),"Date is selected")}),test("setDate",function(){var e=new Date(2013,1,1),t=new Date(Date.UTC(2013,1,1));notEqual(this.dp.date,e),this.dp.setDate(e),datesEqual(this.dp.date,t)}),test("setUTCDate",function(){var e=new Date(Date.UTC(2012,3,5)),t=e;notEqual(this.dp.date,e),this.dp.setUTCDate(e),datesEqual(this.dp.date,t)});