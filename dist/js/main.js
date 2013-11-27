/*!
 * rrule.js - Library for working with recurrence rules for calendar dates.
 * https://github.com/jkbr/rrule
 *
 * Copyright 2010, Jakub Roztocil and Lars Schoning
 * Licenced under the BSD licence.
 * https://github.com/jkbr/rrule/blob/master/LICENCE
 *
 * Based on:
 * python-dateutil - Extensions to the standard Python datetime module.
 * Copyright (c) 2003-2011 - Gustavo Niemeyer <gustavo@niemeyer.net>
 * Copyright (c) 2012 - Tomi Pieviläinen <tomi.pievilainen@iki.fi>
 * https://github.com/jkbr/rrule/blob/master/LICENCE
 *
 * Modified by: Dean Shi
 * Changed: 
 *         1. Fixed loading AMD error
 *         2. Changed Sunday as the first day of the week
 */

/**
 * closure/goog/math/math.js:modulo
 * Copyright 2006 The Closure Library Authors.
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 *     or b < x <= 0, depending on the sign of b).
 */

(function(e,t){typeof exports!="undefined"?module.exports={RRule:t(e,require("underscore"))}:typeof define=="function"&&define.amd?define("rrule",["underscore"],function(n){return e.RRule=t(e,n)}):e.RRule=t(e,e._)})(this,function(e,t){var n=typeof module!="undefined"&&module.exports,r=function(){if(!r._nlp)if(n)r._nlp=require("./nlp");else if(!(r._nlp=e._RRuleNLP))throw"You need to include rrule/nlp.js for fromText/toText to work.";return r._nlp},i={MONTH_DAYS:[31,28,31,30,31,30,31,31,30,31,30,31],ONE_DAY:864e5,MAXYEAR:9999,ORDINAL_BASE:new Date(1970,0,1),PY_WEEKDAYS:[0,1,2,3,4,5,6],getYearDay:function(e){var t=new Date(e.getFullYear(),e.getMonth(),e.getDate());return Math.ceil((t-new Date(e.getFullYear(),0,1))/i.ONE_DAY)+1},isLeapYear:function(e){return e instanceof Date&&(e=e.getFullYear()),e%4===0&&e%100!==0||e%400===0},tzOffset:function(e){return e.getTimezoneOffset()*60*1e3},daysBetween:function(e,t){var n=e.getTime()-i.tzOffset(e),r=t.getTime()-i.tzOffset(t),s=Math.abs(n-r);return Math.round(s/i.ONE_DAY)},toOrdinal:function(e){return i.daysBetween(e,i.ORDINAL_BASE)},fromOrdinal:function(e){var t=e*i.ONE_DAY;return new Date(i.ORDINAL_BASE.getTime()-i.tzOffset(i.ORDINAL_BASE)+t+i.tzOffset(new Date(t)))},monthRange:function(e,t){var n=new Date(e,t,1);return[i.getWeekday(n),i.getMonthDays(n)]},getMonthDays:function(e){var t=e.getMonth();return t==1&&i.isLeapYear(e)?29:i.MONTH_DAYS[t]},getWeekday:function(e){return i.PY_WEEKDAYS[e.getDay()]},combine:function(e,t){return t=t||e,new Date(e.getFullYear(),e.getMonth(),e.getDate(),t.getHours(),t.getMinutes(),t.getSeconds())},clone:function(e){var t=new Date(e.getTime());return t.setMilliseconds(0),t},cloneDates:function(e){var t=[];for(var n=0;n<e.length;n++)t.push(i.clone(e[n]));return t},sort:function(e){e.sort(function(e,t){return e.getTime()-t.getTime()})},timeToUntilString:function(e){var t=new Date(e),n,r=[t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate(),"T",t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),"Z"];for(var i=0;i<r.length;i++)n=r[i],!/[TZ]/.test(n)&&n<10&&(r[i]="0"+String(n));return r.join("")},untilStringToDate:function(e){var t=/^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z)?$/,n=t.exec(e);if(!n)throw new Error("Invalid UNTIL value: "+e);return new Date(Date.UTC(n[1],n[2]-1,n[3],n[5]||0,n[6]||0,n[7]||0))}};i.Time=function(e,t,n){this.hour=e,this.minute=t,this.second=n},i.Time.prototype={getHours:function(){return this.hour},getMinutes:function(){return this.minute},getSeconds:function(){return this.second},getTime:function(){return(this.hour*60*60+this.minute*60+this.second)*1e3}};var s=function(e,t){arguments.length===1&&(t=e,e=0);var n=[];for(var r=e;r<t;r++)n.push(r);return n},o=function(e,t){var n=0,r=[];if(e instanceof Array)for(;n<t;n++)r[n]=[].concat(e);else for(;n<t;n++)r[n]=e;return r},u=function(e,t){var n=e%t;return n*t<0?n+t:n},a=function(e,t){return{div:Math.floor(e/t),mod:u(e,t)}},f=function(e){return e instanceof Array&&e.length==0?!1:Boolean(e)},l=[].concat(o(1,31),o(2,28),o(3,31),o(4,30),o(5,31),o(6,30),o(7,31),o(8,31),o(9,30),o(10,31),o(11,30),o(12,31),o(1,7)),c=[].concat(o(1,31),o(2,29),o(3,31),o(4,30),o(5,31),o(6,30),o(7,31),o(8,31),o(9,30),o(10,31),o(11,30),o(12,31),o(1,7)),h=s(1,29),p=s(1,30),d=s(1,31),v=s(1,32),m=[].concat(v,p,v,d,v,d,v,v,d,v,d,v,v.slice(0,7)),g=[].concat(v,h,v,d,v,d,v,v,d,v,d,v,v.slice(0,7));h=s(-28,0),p=s(-29,0),d=s(-30,0),v=s(-31,0);var y=[].concat(v,p,v,d,v,d,v,v,d,v,d,v,v.slice(0,7)),b=[].concat(v,h,v,d,v,d,v,v,d,v,d,v,v.slice(0,7)),w=[0,31,60,91,121,152,182,213,244,274,305,335,366],E=[0,31,59,90,120,151,181,212,243,273,304,334,365],S=function(){for(var e=[],t=0;t<55;t++)e=e.concat(s(7));return e}(),x=function(e,t){if(t===0)throw"Can't create weekday with n == 0";this.weekday=e,this.n=t};x.prototype={nth:function(e){return this.n==e?this:new x(this.weekday,e)},equals:function(e){return this.weekday==e.weekday&&this.n==e.n},toString:function(){var e=["SU","MO","TU","WE","TH","FR","SA"][this.weekday];return this.n&&(e=(this.n>0?"+":"")+String(this.n)+e),e},getJsWeekday:function(){return this.weekday==6?0:this.weekday+1}};var T=function(e,n){this._string=null;var r=t.clone(T.DEFAULT_OPTIONS);e=e||{},this._cache=n?null:{all:!1,before:[],after:[],between:[]};var s=t(e).chain().keys().reject(function(e){return t.has(r,e)}).value();if(s.length)throw"Invalid options: "+s.join(", ");if(!T.FREQUENCIES[e.freq]&&e.byeaster===null)throw"Invalid frequency: "+String(e.freq);this.origOptions=t.clone(e);var o;this.options=o=t.extend({},r,e),o.byeaster!==null&&(o.freq=T.YEARLY),o.dtstart||(o.dtstart=new Date,o.dtstart.setMilliseconds(0)),o.wkst===null?o.wkst=T.MO.weekday:typeof o.wkst!="number"&&(o.wkst=o.wkst.weekday);if(o.bysetpos!==null){typeof o.bysetpos=="number"&&(o.bysetpos=[o.bysetpos]);for(var u=0;u<o.bysetpos.length;u++){var a=o.bysetpos[u];if(a==0||!(-366<=a&&a<=366))throw"bysetpos must be between 1 and 366, or between -366 and -1"}}if(!(f(o.byweekno)||f(o.byyearday)||f(o.bymonthday)||f(o.byweekday)||o.byeaster!==null))switch(o.freq){case T.YEARLY:o.bymonth||(o.bymonth=o.dtstart.getMonth()+1),o.bymonthday=o.dtstart.getDate();break;case T.MONTHLY:o.bymonthday=o.dtstart.getDate();break;case T.WEEKLY:o.byweekday=i.getWeekday(o.dtstart)}o.bymonth!==null&&!(o.bymonth instanceof Array)&&(o.bymonth=[o.bymonth]),o.byyearday!==null&&!(o.byyearday instanceof Array)&&(o.byyearday=[o.byyearday]);if(o.bymonthday===null)o.bymonthday=[],o.bynmonthday=[];else if(o.bymonthday instanceof Array){var l=[],c=[];for(u=0;u<o.bymonthday.length;u++){var a=o.bymonthday[u];a>0?l.push(a):a<0&&c.push(a)}o.bymonthday=l,o.bynmonthday=c}else o.bymonthday<0?(o.bynmonthday=[o.bymonthday],o.bymonthday=[]):(o.bynmonthday=[],o.bymonthday=[o.bymonthday]);o.byweekno!==null&&!(o.byweekno instanceof Array)&&(o.byweekno=[o.byweekno]);if(o.byweekday===null)o.bynweekday=null;else if(typeof o.byweekday=="number")o.byweekday=[o.byweekday],o.bynweekday=null;else if(o.byweekday instanceof x)!o.byweekday.n||o.freq>T.MONTHLY?(o.byweekday=[o.byweekday.weekday],o.bynweekday=null):(o.bynweekday=[[o.byweekday.weekday,o.byweekday.n]],o.byweekday=null);else{var h=[],p=[];for(u=0;u<o.byweekday.length;u++){var d=o.byweekday[u];typeof d=="number"?h.push(d):!d.n||o.freq>T.MONTHLY?h.push(d.weekday):p.push([d.weekday,d.n])}o.byweekday=f(h)?h:null,o.bynweekday=f(p)?p:null}o.byhour===null?o.byhour=o.freq<T.HOURLY?[o.dtstart.getHours()]:null:typeof o.byhour=="number"&&(o.byhour=[o.byhour]),o.byminute===null?o.byminute=o.freq<T.MINUTELY?[o.dtstart.getMinutes()]:null:typeof o.byminute=="number"&&(o.byminute=[o.byminute]),o.bysecond===null?o.bysecond=o.freq<T.SECONDLY?[o.dtstart.getSeconds()]:null:typeof o.bysecond=="number"&&(o.bysecond=[o.bysecond]);if(o.freq>=T.HOURLY)this.timeset=null;else{this.timeset=[];for(u=0;u<o.byhour.length;u++){var v=o.byhour[u];for(var m=0;m<o.byminute.length;m++){var g=o.byminute[m];for(var y=0;y<o.bysecond.length;y++){var b=o.bysecond[y];this.timeset.push(new i.Time(v,g,b))}}}i.sort(this.timeset)}};T.FREQUENCIES=["YEARLY","MONTHLY","WEEKLY","DAILY","HOURLY","MINUTELY","SECONDLY"],T.YEARLY=0,T.MONTHLY=1,T.WEEKLY=2,T.DAILY=3,T.HOURLY=4,T.MINUTELY=5,T.SECONDLY=6,T.SU=new x(0),T.MO=new x(1),T.TU=new x(2),T.WE=new x(3),T.TH=new x(4),T.FR=new x(5),T.SA=new x(6),T.DEFAULT_OPTIONS={freq:null,dtstart:null,interval:1,wkst:T.SU,count:null,until:null,bysetpos:null,bymonth:null,bymonthday:null,byyearday:null,byweekno:null,byweekday:null,byhour:null,byminute:null,bysecond:null,byeaster:null},T.parseText=function(e,t){return r().parseText(e,t)},T.fromText=function(e,t){return r().fromText(e,t)},T.optionsToString=function(e){var n,r,s,o,u=[];r=t.intersection(t.keys(T.DEFAULT_OPTIONS),t.keys(e));for(var a=0;a<r.length;a++){n=r[a].toUpperCase(),s=e[r[a]],o=[];if(s===null||s instanceof Array&&!s.length)continue;switch(n){case"FREQ":s=T.FREQUENCIES[e.freq];break;case"WKST":s=s.toString();break;case"BYWEEKDAY":n="BYDAY",s instanceof Array||(s=[s]);for(var f,l=0;l<s.length;l++)f=s[l],f instanceof x||(f instanceof Array?f=new x(f[0],f[1]):f=new x(f)),o[l]=f.toString();s=o;break;case"DTSTART":case"UNTIL":s=i.timeToUntilString(s);break;default:if(s instanceof Array){for(var l=0;l<s.length;l++)o[l]=String(s[l]);s=o}else s=String(s)}u.push([n,s])}var c=[];for(var a=0;a<u.length;a++){var h=u[a];c.push(h[0]+"="+h[1].toString())}return c.join(";")},T.prototype={all:function(e){if(e)return this._iter(new k("all",{},e));var t=this._cacheGet("all");return t===!1&&(t=this._iter(new C("all",{})),this._cacheAdd("all",t)),t},between:function(e,t,n,r){var i={before:t,after:e,inc:n};if(r)return this._iter(new k("between",i,r));var s=this._cacheGet("between",i);return s===!1&&(s=this._iter(new C("between",i)),this._cacheAdd("between",s,i)),s},before:function(e,t){var n={dt:e,inc:t},r=this._cacheGet("before",n);return r===!1&&(r=this._iter(new C("before",n)),this._cacheAdd("before",r,n)),r},after:function(e,t){var n={dt:e,inc:t},r=this._cacheGet("after",n);return r===!1&&(r=this._iter(new C("after",n)),this._cacheAdd("after",r,n)),r},count:function(){return this.all().length},toString:function(){return T.optionsToString(this.origOptions)},toText:function(e,t){return r().toText(this,e,t)},isFullyConvertibleToText:function(){return r().isFullyConvertible(this)},_cacheAdd:function(e,t,n){if(!this._cache)return;t&&(t=t instanceof Date?i.clone(t):i.cloneDates(t)),e=="all"?this._cache.all=t:(n._value=t,this._cache[e].push(n))},_cacheGet:function(e,t){if(!this._cache)return!1;var n=!1;if(e=="all")n=this._cache.all;else e:for(var r,s=0;s<this._cache[e].length;s++){r=this._cache[e][s];for(var o in t)if(t.hasOwnProperty(o)&&String(t[o])!=String(r[o]))continue e;n=r._value;break}if(!n&&this._cache.all){var u=new C(e,t);for(var s=0;s<this._cache.all.length;s++)if(!u.accept(this._cache.all[s]))break;n=u.getValue(),this._cacheAdd(e,n,t)}return n instanceof Array?i.cloneDates(n):n instanceof Date?i.clone(n):n},clone:function(){return new T(this.origOptions)},_iter:function(e){var n=this.options.dtstart,r=n.getFullYear(),s=n.getMonth()+1,o=n.getDate(),l=n.getHours(),c=n.getMinutes(),h=n.getSeconds(),p=i.getWeekday(n),d=i.getYearDay(n),v=this.options.freq,m=this.options.interval,g=this.options.wkst,y=this.options.until,b=this.options.bymonth,w=this.options.byweekno,E=this.options.byyearday,S=this.options.byweekday,x=this.options.byeaster,C=this.options.bymonthday,k=this.options.bynmonthday,L=this.options.bysetpos,A=this.options.byhour,O=this.options.byminute,M=this.options.bysecond,D=new N(this);D.rebuild(r,s);var P={};P[T.YEARLY]=D.ydayset,P[T.MONTHLY]=D.mdayset,P[T.WEEKLY]=D.wdayset,P[T.DAILY]=D.ddayset,P[T.HOURLY]=D.ddayset,P[T.MINUTELY]=D.ddayset,P[T.SECONDLY]=D.ddayset,P=P[v];var H;if(v<T.HOURLY)H=this.timeset;else{var B={};B[T.HOURLY]=D.htimeset,B[T.MINUTELY]=D.mtimeset,B[T.SECONDLY]=D.stimeset,B=B[v],v>=T.HOURLY&&f(A)&&!t.include(A,l)||v>=T.MINUTELY&&f(O)&&!t.include(O,c)||v>=T.SECONDLY&&f(M)&&!t.include(M,c)?H=[]:H=B.call(D,l,c,h)}var j,F=0,I=this.options.count,q=0,R,U,z,W,X,V,$,J,K,Q,G,Y;for(;;){$=P.call(D,r,s,o),K=$[0],Q=$[1],G=$[2],j=!1;for(U=Q;U<G;U++){R=K[U];if(f(b)&&!t.include(b,D.mmask[R])||f(w)&&!D.wnomask[R]||f(S)&&!t.include(S,D.wdaymask[R])||f(D.nwdaymask)&&!D.nwdaymask[R]||x!==null&&!t.include(D.eastermask,R)||(f(C)||f(k))&&!t.include(C,D.mdaymask[R])&&!t.include(k,D.nmdaymask[R])||f(E)&&(R<D.yearlen&&!t.include(E,R+1)&&!t.include(E,-D.yearlen+R)||R>=D.yearlen&&!t.include(E,R+1-D.yearlen)&&!t.include(E,-D.nextyearlen+R-D.yearlen)))K[R]=null,j=!0}if(f(L)&&f(H)){var Z,et,tt=[];for(R,U=0;U<L.length;U++){var J=L[U];J<0?(Z=Math.floor(J/H.length),et=u(J,H.length)):(Z=Math.floor((J-1)/H.length),et=u(J-1,H.length));try{$=[];for(z=Q;z<G;z++){var nt=K[z];if(nt===null)continue;$.push(nt)}Z<0?R=$.slice(Z)[0]:R=$[Z];var rt=H[et],it=i.fromOrdinal(D.yearordinal+R),st=i.combine(it,rt);t.include(tt,st)||tt.push(st)}catch(ot){}}i.sort(tt);for(U=0;U<tt.length;U++){var st=tt[U];if(y&&st>y)return this._len=F,e.getValue();if(st>=n){++F;if(!e.accept(st))return e.getValue();if(I){--I;if(!I)return this._len=F,e.getValue()}}}}else for(U=Q;U<G;U++){R=K[U];if(R!==null){var it=i.fromOrdinal(D.yearordinal+R);for(z=0;z<H.length;z++){var rt=H[z],st=i.combine(it,rt);if(y&&st>y)return this._len=F,e.getValue();if(st>=n){++F;if(!e.accept(st))return e.getValue();if(I){--I;if(!I)return this._len=F,e.getValue()}}}}}Y=!1;if(v==T.YEARLY){r+=m;if(r>i.MAXYEAR)return this._len=F,e.getValue();D.rebuild(r,s)}else if(v==T.MONTHLY){s+=m;if(s>12){X=Math.floor(s/12),V=u(s,12),s=V,r+=X,s==0&&(s=12,--r);if(r>i.MAXYEAR)return this._len=F,e.getValue()}D.rebuild(r,s)}else if(v==T.WEEKLY)g>p?o+=-(p+1+(6-g))+m*7:o+=-(p-g)+m*7,p=g,Y=!0;else if(v==T.DAILY)o+=m,Y=!0;else if(v==T.HOURLY){j&&(l+=Math.floor((23-l)/m)*m);for(;;){l+=m,W=a(l,24),X=W.div,V=W.mod,X&&(l=V,o+=X,Y=!0);if(!f(A)||t.include(A,l))break}H=B.call(D,l,c,h)}else if(v==T.MINUTELY){j&&(c+=Math.floor((1439-(l*60+c))/m)*m);for(;;){c+=m,W=a(c,60),X=W.div,V=W.mod,X&&(c=V,l+=X,W=a(l,24),X=W.div,V=W.mod,X&&(l=V,o+=X,Y=!0,j=!1));if((!f(A)||t.include(A,l))&&(!f(O)||t.include(O,c)))break}H=B.call(D,l,c,h)}else if(v==T.SECONDLY){j&&(h+=Math.floor((86399-(l*3600+c*60+h))/m)*m);for(;;){h+=m,W=a(h,60),X=W.div,V=W.mod,X&&(h=V,c+=X,W=a(c,60),X=W.div,V=W.mod,X&&(c=V,l+=X,W=a(l,24),X=W.div,V=W.mod,X&&(l=V,o+=X,Y=!0)));if((!f(A)||t.include(A,l))&&(!f(O)||t.include(O,c))&&(!f(M)||t.include(M,h)))break}H=B.call(D,l,c,h)}if(Y&&o>28){var ut=i.monthRange(r,s-1)[1];if(o>ut){while(o>ut){o-=ut,++s;if(s==13){s=1,++r;if(r>i.MAXYEAR)return this._len=F,e.getValue()}ut=i.monthRange(r,s-1)[1]}D.rebuild(r,s)}}}}},T.parseString=function(e){e=e.replace(/^\s+|\s+$/,"");if(!e.length)return null;var t,n,r,s,o,u=e.split(";"),a={};for(t=0;t<u.length;t++){o=u[t].split("="),r=o[0],s=o[1];switch(r){case"FREQ":a.freq=T[s];break;case"WKST":a.wkst=T[s];break;case"COUNT":case"INTERVAL":case"BYSETPOS":case"BYMONTH":case"BYMONTHDAY":case"BYYEARDAY":case"BYWEEKNO":case"BYHOUR":case"BYMINUTE":case"BYSECOND":if(s.indexOf(",")!=-1){s=s.split(",");for(n=0;n<s.length;n++)/^[+-]?\d+$/.test(s[n])&&(s[n]=Number(s[n]))}else/^[+-]?\d+$/.test(s)&&(s=Number(s));r=r.toLowerCase(),a[r]=s;break;case"BYDAY":var f,l,c,h=s.split(",");a.byweekday=[];for(n=0;n<h.length;n++)c=h[n],c.length==2?(l=T[c],a.byweekday.push(l)):(c=c.match(/^([+-]?\d)([A-Z]{2})$/),f=Number(c[1]),l=c[2],l=T[l].weekday,a.byweekday.push(new x(l,f)));break;case"DTSTART":a.dtstart=i.untilStringToDate(s);break;case"UNTIL":a.until=i.untilStringToDate(s);break;case"BYEASTER":a.byeaster=Number(s);break;default:throw new Error("Unknown RRULE property '"+r+"'")}}return a},T.fromString=function(e){return new T(T.parseString(e))};var N=function(e){this.rrule=e,this.lastyear=null,this.lastmonth=null,this.yearlen=null,this.nextyearlen=null,this.yearordinal=null,this.yearweekday=null,this.mmask=null,this.mrange=null,this.mdaymask=null,this.nmdaymask=null,this.wdaymask=null,this.wnomask=null,this.nwdaymask=null,this.eastermask=null};N.prototype.easter=function(e,t){t=t||0;var n=e%19,r=Math.floor(e/100),i=e%100,s=Math.floor(r/4),o=r%4,u=Math.floor((r+8)/25),a=Math.floor((r-u+1)/3),f=Math.floor(19*n+r-s-a+15)%30,l=Math.floor(i/4),c=i%4,h=Math.floor(32+2*o+2*l-f-c)%7,p=Math.floor((n+11*f+22*h)/451),d=Math.floor((f+h-7*p+114)/31),v=(f+h-7*p+114)%31+1,m=Date.UTC(e,d-1,v+t),g=Date.UTC(e,0,1);return[Math.ceil((m-g)/864e5)]},N.prototype.rebuild=function(e,n){var r=this.rrule;if(e!=this.lastyear){this.yearlen=i.isLeapYear(e)?366:365,this.nextyearlen=i.isLeapYear(e+1)?366:365;var s=new Date(e,0,1);this.yearordinal=i.toOrdinal(s),this.yearweekday=i.getWeekday(s);var a=i.getWeekday(new Date(e,0,1));this.yearlen==365?(this.mmask=[].concat(l),this.mdaymask=[].concat(g),this.nmdaymask=[].concat(b),this.wdaymask=S.slice(a),this.mrange=[].concat(E)):(this.mmask=[].concat(c),this.mdaymask=[].concat(m),this.nmdaymask=[].concat(y),this.wdaymask=S.slice(a),this.mrange=[].concat(w));if(!f(r.options.byweekno))this.wnomask=null;else{this.wnomask=o(0,this.yearlen+7);var h,p,d;h=p=u(7-this.yearweekday+r.options.wkst,7),h>=4?(h=0,d=this.yearlen+u(this.yearweekday-r.options.wkst,7)):d=this.yearlen-h;var v=Math.floor(d/7),x=u(d,7),N=Math.floor(v+x/4);for(var C,k,L=0;L<r.options.byweekno.length;L++){C=r.options.byweekno[L],C<0&&(C+=N+1);if(!(0<C&&C<=N))continue;C>1?(k=h+(C-1)*7,h!=p&&(k-=7-p)):k=h;for(var A=0;A<7;A++){this.wnomask[k]=1,k++;if(this.wdaymask[k]==r.options.wkst)break}}if(t.include(r.options.byweekno,1)){var k=h+N*7;h!=p&&(k-=7-p);if(k<this.yearlen)for(var L=0;L<7;L++){this.wnomask[k]=1,k+=1;if(this.wdaymask[k]==r.options.wkst)break}}if(h){var O;if(!t.include(r.options.byweekno,-1)){var M=i.getWeekday(new Date(e-1,0,1)),D=u(7-M+r.options.wkst,7),P=i.isLeapYear(e-1)?366:365;D>=4?(D=0,O=Math.floor(52+u(P+u(M-r.options.wkst,7),7)/4)):O=Math.floor(52+u(this.yearlen-h,7)/4)}else O=-1;if(t.include(r.options.byweekno,O))for(var k=0;k<h;k++)this.wnomask[k]=1}}}if(f(r.options.bynweekday)&&(n!=this.lastmonth||e!=this.lastyear)){var H=[];if(r.options.freq==T.YEARLY)if(f(r.options.bymonth))for(L=0;L<r.options.bymonth.length;L++)n=r.options.bymonth[L],H.push(this.mrange.slice(n-1,n+1));else H=[[0,this.yearlen]];else r.options.freq==T.MONTHLY&&(H=[this.mrange.slice(n-1,n+1)]);if(f(H)){this.nwdaymask=o(0,this.yearlen);for(var L=0;L<H.length;L++){var B=H[L],j=B[0],F=B[1];F-=1;for(var A=0;A<r.options.bynweekday.length;A++){var a=r.options.bynweekday[A][0],C=r.options.bynweekday[A][1];C<0?(k=F+(C+1)*7,k-=u(this.wdaymask[k]-a,7)):(k=j+(C-1)*7,k+=u(7-this.wdaymask[k]+a,7)),j<=k&&k<=F&&(this.nwdaymask[k]=1)}}}this.lastyear=e,this.lastmonth=n}r.options.byeaster!==null&&(this.eastermask=this.easter(e,r.options.byeaster))},N.prototype.ydayset=function(e,t,n){return[s(this.yearlen),0,this.yearlen]},N.prototype.mdayset=function(e,t,n){var r=o(null,this.yearlen),i=this.mrange[t-1],s=this.mrange[t];for(var u=i;u<s;u++)r[u]=u;return[r,i,s]},N.prototype.wdayset=function(e,t,n){var r=o(null,this.yearlen+7),s=i.toOrdinal(new Date(e,t-1,n))-this.yearordinal,u=s;for(var a=0;a<7;a++){r[s]=s,++s;if(this.wdaymask[s]==this.rrule.options.wkst)break}return[r,u,s]},N.prototype.ddayset=function(e,t,n){var r=o(null,this.yearlen),s=i.toOrdinal(new Date(e,t-1,n))-this.yearordinal;return r[s]=s,[r,s,s+1]},N.prototype.htimeset=function(e,t,n){var r=[],s=this.rrule;for(var o=0;o<s.options.byminute.length;o++){t=s.options.byminute[o];for(var u=0;u<s.options.bysecond.length;u++)n=s.options.bysecond[u],r.push(new i.Time(e,t,n))}return i.sort(r),r},N.prototype.mtimeset=function(e,t,n){var r=[],s=this.rrule;for(var o=0;o<s.options.bysecond.length;o++)n=s.options.bysecond[o],r.push(new i.Time(e,t,n));return i.sort(r),r},N.prototype.stimeset=function(e,t,n){return[new i.Time(e,t,n)]};var C=function(e,t){this.init(e,t)};C.prototype={init:function(e,t){this.method=e,this.args=t,this._result=[],this.minDate=null,this.maxDate=null,e=="between"?(this.maxDate=t.inc?t.before:new Date(t.before.getTime()-1),this.minDate=t.inc?t.after:new Date(t.after.getTime()+1)):e=="before"?this.maxDate=t.inc?t.dt:new Date(t.dt.getTime()-1):e=="after"&&(this.minDate=t.inc?t.dt:new Date(t.dt.getTime()+1))},accept:function(e){var t=this.minDate&&e<this.minDate,n=this.maxDate&&e>this.maxDate;if(this.method=="between"){if(t)return!0;if(n)return!1}else if(this.method=="before"){if(n)return!1}else if(this.method=="after")return t?!0:(this.add(e),!1);return this.add(e)},add:function(e){return this._result.push(e),!0},getValue:function(){switch(this.method){case"all":case"between":return this._result;case"before":case"after":return this._result.length?this._result[this._result.length-1]:null}}};var k=function(e,n,r){var i=["all","between"];if(!t.include(i,e))throw'Invalid method "'+e+'". Only all and between works with iterator.';this.add=function(e){return r(e,this._result.length)?(this._result.push(e),!0):!1},this.init(e,n)};return k.prototype=C.prototype,T}),define("views/EventEditor",["jquery","underscore","backbone","moment","rrule","bootstrap","daterangepicker","datepicker","icheck"],function(e,t,n,r,i){var s=function(e){var t="",n=["years","months","weeks","days"],r=["Annually","Monthly","Weekly","Daily"],s=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],o=["January","February","March","April","May","June","July","August","September","October","November","December"];e.interval===1?t+=r[e.freq]:t+="Every "+e.interval+" "+n[e.freq];if(i.WEEKLY===e.freq){t+=" on ";if(e.byweekday.length===s.length)t+="all days ";else for(var u=0;u<e.byweekday.length;u++){var a=e.byweekday[u];t+=s[a],u!=e.byweekday.length-1&&(t+=", ")}}else if(i.MONTHLY===e.freq){t+=" on day ";var f=e.dtstart;t+=f.getDate()}else if(i.YEARLY===e.freq){t+=" on ";var f=e.dtstart;t+=o[f.getMonth()]+" "+f.getDate()}return e.count?e.count===1?t="Once":t+=", "+e.count+" times":e.until&&(t+=", until "+(new Date(e.until)).toDateString()),t},o=n.View.extend({el:"#repeat-dialog",initialize:function(e){var n=this,r=this.$("#repeat-done"),s=this.$("#repeat-close"),o=this.$("#repeat-by"),u=this.$("#repeat-on");this.editorPanel=e.editorPanel,this.rrule=e.rrule,this.start=e.start;var a=!t.isNull(this.rrule),f=t.once(function(){a=!0});this.$el.modal({backdrop:!1}),a||(this.rrule={freq:i.WEEKLY,interval:1,byweekday:[],dtstart:this.start},this.rrule.byweekday.push(this.rrule.dtstart.getDay())),this.renderPanel(),r.on("click",function(){if(i.WEEKLY===n.rrule.freq&&0===n.rrule.byweekday.length){alert("Cannot add this repeating event without setting any by day.");return}f(),n.$el.modal("hide"),n.editorPanel.trigger("rruleUpdate",n.rrule)}),s.on("click",function(){a||n.editorPanel.trigger("cancelRepeat")})},render:function(){this.registerRepeatFreq(),this.registerRepeatInterval(),this.registerRepeatOn(),this.registerRepeatEnd(),this.showSummaryOnDialog()},showSummaryOnDialog:function(){var e=s(this.rrule);this.$("#repeat-summary").html(e)},renderPanel:function(){var n=t.template(e("#repeatDialogTemplate").html(),{rrule:this.rrule});this.$(".modal-body table").html(n)},registerRepeatFreq:function(){var t=this;t.$("#repeat-frequency").on("change",function(){t.rrule.freq=parseInt(e(this).val()),t.renderPanel(),t.render()})},registerRepeatInterval:function(){var t=this;t.$("#repeat-interval").on("change",function(){t.rrule.interval=parseInt(e(this).val()),t.showSummaryOnDialog()})},registerRepeatOn:function(){var n=this;e("#repeat-on input[type=checkbox]").each(function(){var r=["SU","MO","TU","WE","TH","FR","SA"];e(this).change(function(){if(this.checked)n.rrule.byweekday.push(t.indexOf(r,this.name)),n.rrule.byweekday.sort();else{var e=t.indexOf(r,this.name);n.rrule.byweekday=t.without(n.rrule.byweekday,e)}n.showSummaryOnDialog()})})},registerRepeatEnd:function(){var t=this,n=this.$("#repeat-ends-never"),r=this.$("#repeat-ends-count"),i=this.$("#repeat-ends-count_input"),s=this.$("#repeat-ends-until"),o=this.$("#repeat-ends-until_input");e(".modal .repeat-ends-option input").iCheck({checkboxClass:"icheckbox_square-green",radioClass:"iradio_square-green",increaseArea:"20%"}),n.on("ifChecked",function(e){i.attr("disabled","disabled"),o.attr("disabled","disabled"),t.rrule.until=null,t.rrule.count=null,t.showSummaryOnDialog()}),r.on("ifChecked",function(e){i.removeAttr("disabled"),o.attr("disabled","disabled"),t.rrule.until=null,t.rrule.count=parseInt(i.val()),t.showSummaryOnDialog()}),s.on("ifChecked",function(e){o.removeAttr("disabled"),i.attr("disabled","disabled"),t.rrule.until=new Date(o.val()),t.rrule.count=null,t.showSummaryOnDialog()}),o.datepicker({autoclose:!0,startDate:t.rrule.dtstart||t.acalEvent.start}).on("changeDate",function(e){t.rrule.until=e.date,console.log(t.rrule.until)}).on("hide",function(){hidingDatepicker=!0})}});return n.View.extend({el:"#editor-panel",events:{"click #event-save":"save","click #event-return":"close","click #event-delete":"delete"},initialize:function(){},render:function(){this.$el.show(),this.acalEvent=this.model,this.rrule=this.acalEvent.get("rrule"),this.start=this.acalEvent.get("start"),this.repeatDialog=new o({editorPanel:this,rrule:this.rrule,start:this.start}),this.renderEditorTemplate(this.acalEvent);var e=this,t=e.$("#repeat-dialog"),n=!1;e.registerDaterangepicker(),e.registerCheckbox(),e.registerRepeatDialog()},renderEditorTemplate:function(n){var i=n.get("start").toString(),s=n.get("end")?n.get("end").toString():i,o=r(i).format("YYYY/MM/DD h:mm A")+" - "+r(s).format("YYYY/MM/DD h:mm A"),u=r(i).format("YYYY/MM/DD")+" - "+r(s).format("YYYY/MM/DD"),a=t.template(e("#eventEditorTemplate").html(),{event:n.toJSON(),dateTimeRange:o,dateRange:u});this.$el.html(a)},registerDaterangepicker:function(){function r(t,n){e.acalEvent.set("start",new Date(t)),e.acalEvent.set("end",new Date(n))}var e=this,t=e.$("#date-time-range"),n=e.$("#date-range");t.daterangepicker({timePicker:!0,timePickerIncrement:30,format:"YYYY/MM/DD h:mm A"},function(e,t){n.val(e.format("YYYY/MM/DD")+" - "+t.format("YYYY/MM/DD")),r(e,t)}),n.daterangepicker({format:"YYYY/MM/DD"},function(e,n){t.val(e.format("YYYY/MM/DD h:mm A")+" - "+n.format("YYYY/MM/DD h:mm A")),r(e,n)})},registerCheckbox:function(){function l(e){var t=e,n=t.next(),r=n.text();n.remove(),t.iCheck({checkboxClass:"icheckbox_line-blue",radioClass:"iradio_line-blue",insert:'<div class="icheck_line-icon"></div>'+r})}var e=this,n=this.acalEvent.get("rrule"),r=!t.isNull(n),i=this.$("#event-repeat-summary-area"),s=this.$("#event-repeat-edit"),o=e.$("#date-time-range"),u=e.$("#date-range"),a=this.$("#check-allday"),f=this.$("#check-repeat");l(a),l(f);var c=t.once(function(){s.on("click",function(){e.repeatDialog.$el.modal("show"),console.log(e.repeatDialog)})});a.on("ifToggled",function(){u.toggle(),o.toggle(),e.acalEvent.set("allDay",!e.acalEvent.get("allDay"))}),f.on("ifChecked",function(t){r?i.show():e.repeatDialog.$el.modal("show"),e.rrule=n}),f.on("ifUnchecked",function(t){i.hide(),e.rrule=null}),r&&(this.showSummaryOnPanel(n),f.iCheck("check"),c()),this.listenTo(this,"rruleUpdate",function(t){e.rrule=n=t,e.showSummaryOnPanel(n),i.show(),c()}),this.listenTo(this,"cancelRepeat",function(){f.iCheck("uncheck")})},registerRepeatDialog:function(){this.repeatDialog.render()},showSummaryOnPanel:function(e){var t=s(e);this.$("#event-repeat-summary-text").html(t)},generateId:function(){return(new Date).getTime().toString()},close:function(){this.calendarView.trigger("show"),this.$el.hide(),e(".daterangepicker").remove(),e(".modal-body table").children().remove()},save:function(){if(this.$("#event-title-input").val()===""&&!confirm("Are you sure you want to save this event without title?"))return;console.log(this.rrule),t.isNull(this.rrule)||(this.rrule.dtstart=this.acalEvent.get("start")),this.acalEvent.set({title:this.$("#event-title-input").val()||"Untitled Event",allDay:this.acalEvent.get("allDay"),start:this.acalEvent.get("start"),end:this.acalEvent.get("end"),rrule:this.rrule,last_modified:new Date}),this.acalEvent.isNew()?(this.acalEvent.set({_id:this.generateId()}),this.collection.create(this.acalEvent,{success:this.close()})):(this.collection.get(this.acalEvent.get("_id")).save(this.acalEvent.toJSON(),{success:this.close()}),console.log(this.collection))},"delete":function(){confirm("Are you sure you want to delete this event?")&&this.acalEvent.destroy({success:this.close()})}})}),define("models/Event",["backbone"],function(e){return e.Model.extend({idAttribute:"_id"})}),define("collections/Events",["backbone","models/Event"],function(e,t){return e.Collection.extend({model:t,url:"event"})}),define("modules/Backbone.sync",["underscore","backbone","bongo"],function(e,t,n){n.db({name:"calendar",collections:["local"]}),t.sync=function(e,t,r){var i=t.toJSON(),s=n.db("calendar").collection("local"),o=function(){var e=null;s.find({}).toArray(function(e,t){e||r.success(t)})},u=function(e){s.save(i,function(t,n){t||(console.log(e+" event in db: "+n),r.success(i))})},a=function(){s.remove(i._id.toString(),function(e){e||console.log("delete event in db: "+i._id)})};switch(e){case"create":case"update":u(e);break;case"read":o();break;case"delete":a()}}}),define("views/Calendar",["jquery","underscore","backbone","rrule","views/EventEditor","models/Event","collections/Events","modules/Backbone.sync","fullCalendar","bootstrap","jqueryui","qtip"],function(e,t,n,r,i,s,o){var u=n.View.extend({initialize:function(){var t=this;this.$el=e("<div/>").qtip({id:"tooltip",prerender:!0,content:{text:"",title:"New Event",button:"Close"},position:{my:"bottom center",at:"top center",viewport:e(window),target:"event"},events:{render:function(t,n){e(window).on("keydown",function(e){e.keyCode===27&&n.hide(e)})},hide:function(e,n){n.elements.tooltip.stop(1,1),t.calendarView.$el.fullCalendar("unselect")}},hide:!1,style:"qtip-bootstrap"}).qtip("api")},render:function(e){this.$el.elements.tooltip.stop(1,1),this.$el.reposition(e).toggle(!0,e)},set:function(e,t,n,r){this.start=e,this.end=t,this.allDay=n,this.$el.set({"content.text":r})},isBlank:function(e){return/^\s*$/.test(e)},hide:function(){this.$el.toggle(!1)},generateId:function(){return(new Date).getTime().toString()},listener:function(){function a(){var e=r.val();if(t.isBlank(e)){alert("Event title cannot be an empty or blank string.");return}var n={_id:t.generateId(),title:e,allDay:t.allDay,start:t.start,end:t.end,rrule:null,last_modified:new Date};t.collection.create(new s(n),{success:t.hide()}),console.log(t.collection.toJSON())}var t=this,n=e("#qtip-tooltip"),r=n.find("#tooltip-title-input").focus(),i=n.find("#tooltip-create-event"),o=n.find("#tooltip-cancel"),u=n.find("#advanced-edit");i.on("click",a),r.on("keydown",function(e){e.keyCode===13&&a()}),u.on("click",function(){var e={_id:null,title:r.val(),allDay:t.allDay,start:t.start,end:t.end,rrule:null,last_modified:null};t.calendarView.hideView(),t.eventEditorView.model=new s(e),t.eventEditorView.render(),t.hide()}),o.on("click",function(){t.hide()})}});return n.View.extend({el:"#calendar",initialize:function(){t.bindAll(this,"select","unselect","loading","eventRender","eventDragStart","eventResizeStart","eventDrop","eventResize","eventClick"),this.eventResizing=!1,this.elementArray=[],this.tooltip=new u,this.eventEditorView=new i,this.render()},render:function(){this.onloading={pleaseWaitDiv:e("#pleaseWaitDialog"),showPleaseWait:function(){this.pleaseWaitDiv.modal("show")},hidePleaseWait:function(){this.pleaseWaitDiv.modal("hide")}},this.$el.fullCalendar({header:{left:"prev,next today title",right:"month,agendaWeek,agendaDay"},height:e(window).height()-80,timeFormat:"h:mmtt{ - h:mmtt}",editable:!0,selectable:!0,selectHelper:!0,select:this.select,slotMinutes:15,unselect:this.unselect,unselectCancel:".qtip",loading:this.loading,eventResizeStart:this.eventResizeStart,eventDragStart:this.eventDragStart,eventClick:this.eventClick,eventDrop:this.eventDrop,eventResize:this.eventResize,eventRender:this.eventRender,eventAfterAllRender:this.eventAfterAllRender}),this.tooltip.collection=this.eventEditorView.collection=this.collection,this.tooltip.calendarView=this.eventEditorView.calendarView=this,this.tooltip.eventEditorView=this.eventEditorView;var t=this;this.collection.fetch({success:function(e){console.log(e.toJSON()),t.listenTo(t.collection,"add change update destroy",function(){t.$el.fullCalendar("refetchEvents")}),t.renderEvents()}}),this.on("show",this.showView),e(window).on("resize",function(){if(t.eventResizing)return;t.resizeCalendar(),t.destroyQtip(),t.$el.fullCalendar("rerenderEvents")})},showView:function(){this.$el.show(),this.resizeCalendar()},hideView:function(){this.$el.hide()},resizeCalendar:function(){this.$el.fullCalendar("option","height",e(window).height()-80)},renderEvents:function(){var e=this,n={events:function(n,i,s){var o=[],u=[];e.collection.filter(function(e){e.get("rrule")==null?o.push(e.toJSON()):u.push(e.toJSON())});for(var a=u.length-1;a>=0;a--){var f=u[a],l=new r(f.rrule),c=l.between(n,i,!0),h=f.end?f.end.getTime()-f.start.getTime():0;for(var p=c.length-1;p>=0;p--){var d=t.clone(f);d.start=c[p],d.end=new Date(d.start.getTime()+h),e.$el.fullCalendar("renderEvent",d)}}s(o)},color:"",textColor:""};this.$el.fullCalendar("addEventSource",n)},select:function(e,t,n,r){var i=this,s=this.popover(e,t,n,null,!0);this.tooltip.set(e,t,n,s),this.tooltip.render(r),this.tooltip.listener()},unselect:function(){this.hideTooltip()},loading:function(e){e?this.onloading.showPleaseWait():this.onloading.hidePleaseWait()},eventClick:function(e){},eventDrop:function(e,t,n,r,i){this.eventDropOrResize(e,i)},eventResize:function(e,t,n,r){this.eventDropOrResize(e,r),this.eventResizing=!1},eventDropOrResize:function(e,n){var r=this.collection.get(e._id),i=r.get("rrule");t.isNull(i)||(i.dtstart=e.start),this.collection.get(e._id).save({start:e.start,end:e.end,rrule:i})},eventResizeStart:function(e){this.hideQtip(e),this.eventResizing=!0},eventDragStart:function(e){this.hideQtip(e)},popover:function(t,n,r,i,s){var o=new Date(t),u=new Date(n),a="ddd, MMMM d",f="",l="";if(n&&(!r||o.getDate()!=u.getDate())){f=" - ";if(o.getFullYear()!=u.getFullYear())f+=a+=", yyyy";else if(o.getDate()!=u.getDate()||o.getMonth()!=u.getMonth())f+=a}return r||(a+=", h(:mm)tt",f+="h(:mm)tt"),o=e.fullCalendar.formatDate(o,a),u=e.fullCalendar.formatDate(u,f),s?l='<table><tbody><tr><th>Date:  </th><td id="tooltip-date">'+o+u+"</td>"+"</tr>"+"<tr>"+"<th>Title: </th>"+'<td><input id="tooltip-title-input" type="text" class="form-control"></td>'+"</tr>"+"<tr>"+'<td colspan="2">'+'<button id="tooltip-create-event" type="button" class="btn btn-xs btn-primary">Create</button>'+'<button id="tooltip-cancel" type="button" class="btn btn-xs btn-default">Cancel</button>'+'<a href="javascript:void(0)" id="advanced-edit">Advanced Edit</a>'+"</td>"+"</tr>"+"</tbody>"+"</table>":l="<h3>"+i+"</h3>"+"<p><b>Date:</b> "+o+(n&&u+"</p>"||""),l},eventRender:function(n,r){var i=this.popover(n.start,n.end,n.allDay,n.title,!1),s=n._id+(n.rrule?"-"+n.start.getTime():"");t.isUndefined(this.elementArray[s])||this.elementArray[s].destroy(!0);var o=this,u=r.qtip({id:s,content:{title:n.title+'<div class="pull-right"><a class="qtip-edit" title="Edit" aria-label="Edit" role="button"><span class="glyphicon glyphicon-edit"></span></a><a class="qtip-delete" title="Delete" aria-label="Delete" role="button" style="margin-left: 5px"><span class="glyphicon glyphicon-trash"></span></a></div>',text:i},position:{my:"bottom center",at:"top center",viewport:e(window)},events:{render:function(t,n){var r=n.id.replace(/-.*/,"");e(this).on("click",".qtip-edit",function(){n.toggle(!1),o.hideView(),o.tooltip.hide(),o.eventEditorView.model=o.collection.get(r),o.eventEditorView.render()}),e(this).on("click",".qtip-delete",function(){confirm("Are you sure you want to delete this event?")&&o.collection.get(r).destroy({success:n.destroy(!0)})})}},hide:{fixed:!0,delay:300},style:"qtip-bootstrap"}).qtip("api");this.elementArray[s]=u},eventAfterAllRender:function(){console.log("all render")},hideTooltip:function(){this.tooltip.hide()},hideQtip:function(t){e("#qtip-"+t._id).qtip().hide()},destroyQtip:function(){var e;while(e=this.elementArray.pop())e.destroy(!0)}})}),define("routers/router",["jquery","underscore","backbone","views/Calendar","views/EventEditor","collections/Events"],function(e,t,n,r,i,s){return n.Router.extend({routes:{"*actions":"index",editor:"editor",catalog:""},initialize:function(){},index:function(){new r({collection:new s})},editor:function(){new i}})}),define("app",["backbone","routers/router"],function(e,t){return{init:function(){new t,e.history.start()},setupPrint:function(){var e=$("#calendar"),t=e.css("width"),n=function(){e.css("width","999"),e.fullCalendar("render")},r=function(){e.css("width",t),e.fullCalendar("render")};if(window.matchMedia){var i=window.matchMedia("print");i.addListener(function(e){e.matches?n():r()})}window.onbeforeprint=n,window.onafterprint=r}}}),requirejs.config({paths:{jquery:["http://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min","vendor/jquery/jquery.min"],jqueryui:["http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min","libs/jquery/jquery-ui.custom.min"],underscore:["http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min","vendor/underscore/underscore-min"],backbone:["http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min","vendor/backbone/backbone-min"],bootstrap:["http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.0/js/bootstrap.min","vendor/bootstrap/dist/js/bootstrap.min"],fullCalendar:["http://cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/fullcalendar.min","vendor/fullcalendar/fullCalendar.min"],moment:["http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.1.0/moment.min","vendor/momentjs/min/moment.min"],datepicker:["http://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.2.0/js/bootstrap-datepicker.min","vendor/bootstrap-datepicker/js/bootstrap-datepicker"],rrule:"libs/rrule",daterangepicker:"vendor/bootstrap-daterangepicker/daterangepicker",qtip:"vendor/qtip2/jquery.qtip.min",icheck:"vendor/jquery-icheck/jquery.icheck.min",bongo:"vendor/bongo.js/dist/bongo.min",keymaster:"libs/keymaster.min",templates:"../templates"},shim:{underscore:{exports:"_"},backbone:{deps:["underscore","jquery"],exports:"Backbone"},fullCalendar:["jquery"],bootstrap:["jquery"],daterangepicker:["jquery","moment"],datepicker:["jquery"],icheck:["jquery"],keymaster:{exports:"key"}},urlArgs:"bust="+(new Date).getTime()}),requirejs(["app"],function(e){e.init(),e.setupPrint()}),define("main",function(){});