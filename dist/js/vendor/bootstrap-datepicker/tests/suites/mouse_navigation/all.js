module("Mouse Navigation (All)",{setup:function(){this.input=$('<input type="text">').appendTo("#qunit-fixture").datepicker({format:"dd-mm-yyyy"}).focus(),this.dp=this.input.data("datepicker"),this.picker=this.dp.picker},teardown:function(){this.picker.remove()}}),test("Clicking datepicker does not hide datepicker",function(){ok(this.picker.is(":visible"),"Picker is visible"),this.picker.trigger("mousedown"),ok(this.picker.is(":visible"),"Picker is still visible")}),test("Clicking outside datepicker hides datepicker",function(){var e=$("<div />");$("body").append(e),ok(this.picker.is(":visible"),"Picker is visible"),this.input.trigger("click"),ok(this.picker.is(":visible"),"Picker is still visible"),e.trigger("mousedown"),ok(this.picker.is(":not(:visible)"),"Picker is hidden"),e.remove()});