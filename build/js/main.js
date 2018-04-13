(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime();
        this.name = taskname;
        this.status = false;
    }
    return Task;
}());
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        console.log(this.tasks);
    };
    return TaskManager;
}());
var ListView = /** @class */ (function () {
    function ListView(listid) {
        this.list = document.getElementById(listid);
    }
    ListView.prototype.render = function (items) {
        var _this = this;
        items.forEach(function (task) {
            var id = task.id;
            var name = task.name;
            var status = task.status;
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function-\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    return ListView;
}());
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array) {
        var data = JSON.stringify(array);
        this.storage.setItem('taskdata', data);
    };
    DataStorage.prototype.read = function () {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        return array;
    };
    return DataStorage;
}());
//initialise
var taskarray = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read();
    taskdata.forEach(function (item) { taskarray.push(item); });
    listview.render(taskarray);
});
//reference to form
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    // console.log(taskname);
    var task = new Task(taskname);
    taskmanager.add(task);
    listview.clear();
    taskstorage.store(taskarray);
    listview.render(taskarray);
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9tYWluLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0lBSUUsY0FBWSxRQUFnQjtRQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQVRBLEFBU0MsSUFBQTtBQUVEO0lBRUEscUJBQWEsS0FBa0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbkIsQ0FBQztJQUNELHlCQUFHLEdBQUgsVUFBSyxJQUFVO1FBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUM7SUFDMUIsQ0FBQztJQUNELGtCQUFDO0FBQUQsQ0FUQSxBQVNDLElBQUE7QUFFRDtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFBekIsaUJBaUJDO1FBaEJHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxRQUFRLEdBQUcsY0FBVyxFQUFFLHlCQUFrQixNQUFNLGtJQUVQLElBQUksc1VBTTVDLENBQUM7WUFDTixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUUsUUFBUSxDQUFFLENBQUM7WUFDM0UsS0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Qsd0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFFLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0wsZUFBQztBQUFELENBMUJBLEFBMEJDLElBQUE7QUFFRDtJQUVJO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3ZDLENBQUM7SUFDRCwyQkFBSyxHQUFMLFVBQU8sS0FBa0I7UUFDckIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNHLDBCQUFJLEdBQUo7UUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTCxrQkFBQztBQUFELENBZEosQUFjSyxJQUFBO0FBRUwsWUFBWTtBQUNaLElBQUksU0FBUyxHQUFjLEVBQUUsQ0FBQztBQUM5QixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ3BDLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXpDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7SUFDN0IsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRWpDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLElBQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO0lBQ3BELFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFHSCxtQkFBbUI7QUFDbkIsSUFBTSxRQUFRLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFFLENBQUM7QUFDMUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBQyxVQUFFLEtBQVk7SUFDL0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEQsSUFBSSxRQUFRLEdBQXNCLEtBQU0sQ0FBQyxLQUFLLENBQUM7SUFDN0MsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3BCLHlCQUF5QjtJQUN0QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBRSxRQUFRLENBQUUsQ0FBQztJQUNoQyxXQUFXLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBRSxDQUFDO0lBQ3hCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBUYXNre1xuICBpZDogbnVtYmVyO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gIH0gIFxufVxuXG5jbGFzcyBUYXNrTWFuYWdlcntcbnRhc2tzIDogQXJyYXk8VGFzaz47XG5jb25zdHJ1Y3RvciggYXJyYXk6IEFycmF5PFRhc2s+KXtcbnRoaXMudGFza3MgPSBhcnJheTtcbn1cbmFkZCggdGFzazogVGFzayApe1xudGhpcy50YXNrcy5wdXNoKHRhc2spO1xuY29uc29sZS5sb2coIHRoaXMudGFza3MgKTtcbn1cbn1cblxuY2xhc3MgTGlzdFZpZXd7XG4gICAgbGlzdDpIVE1MRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvciggbGlzdGlkOnN0cmluZyApe1xuICAgICAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XG4gICAgfVxuICAgIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgodGFzaykgPT4ge1xuICAgICAgICAgICAgbGV0IGlkID0gdGFzay5pZDtcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzO1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stbmFtZVwiPiR7bmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uLVwiZGVsZXRlXCI+JnRpbWVzOzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxsaT5gO1xuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYXIoKXtcbiAgICAgICAgdGhpcy5saXN0LmlubmVySFRNTCA9Jyc7XG4gICAgfVxufVxuXG5jbGFzcyBEYXRhU3RvcmFnZXtcbiAgICBzdG9yYWdlO1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgfVxuICAgIHN0b3JlKCBhcnJheTpBcnJheSA8VGFzaz4gKXtcbiAgICAgICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSggYXJyYXkpO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSgndGFza2RhdGEnLCBkYXRhKTtcbiAgICB9XG4gICAgICAgIHJlYWQoKXtcbiAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XG4gICAgICAgICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9XG4gICAgfVxuXG4vL2luaXRpYWxpc2VcbnZhciB0YXNrYXJyYXk6QXJyYXk8YW55PiA9IFtdO1xudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcbnZhciBsaXN0dmlldyA9IG5ldyBMaXN0VmlldygndGFzay1saXN0Jyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgbGV0IHRhc2tkYXRhID0gdGFza3N0b3JhZ2UucmVhZCgpO1xuICAgXG4gICAgdGFza2RhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge3Rhc2thcnJheS5wdXNoKGl0ZW0pO30pO1xuICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xufSk7XG5cblxuLy9yZWZlcmVuY2UgdG8gZm9ybVxuY29uc3QgdGFza2Zvcm0gPSAoPEhUTUxGb3JtRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stZm9ybScpKTtcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcbiAgbGV0IHRhc2tuYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcbiAgICB0YXNrZm9ybS5yZXNldCgpO1xuIC8vIGNvbnNvbGUubG9nKHRhc2tuYW1lKTtcbiAgICBsZXQgdGFzayA9IG5ldyBUYXNrKCB0YXNrbmFtZSApO1xuICAgIHRhc2ttYW5hZ2VyLmFkZCggdGFzayApO1xuICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5KTtcbiAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbn0pOyJdfQ==
