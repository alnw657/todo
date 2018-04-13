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
//initialise
var taskarray = [];
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');
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
    listview.render(taskarray);
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9tYWluLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0lBSUUsY0FBWSxRQUFnQjtRQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQVRBLEFBU0MsSUFBQTtBQUVEO0lBRUEscUJBQWEsS0FBa0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbkIsQ0FBQztJQUNELHlCQUFHLEdBQUgsVUFBSyxJQUFVO1FBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUM7SUFDMUIsQ0FBQztJQUNELGtCQUFDO0FBQUQsQ0FUQSxBQVNDLElBQUE7QUFFRDtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFBekIsaUJBaUJDO1FBaEJHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxRQUFRLEdBQUcsY0FBVyxFQUFFLHlCQUFrQixNQUFNLGtJQUVQLElBQUksc1VBTTVDLENBQUM7WUFDTixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUUsUUFBUSxDQUFFLENBQUM7WUFDM0UsS0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Qsd0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFFLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0wsZUFBQztBQUFELENBMUJBLEFBMEJDLElBQUE7QUFDRCxZQUFZO0FBQ1osSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXpDLG1CQUFtQjtBQUNuQixJQUFNLFFBQVEsR0FBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUUsQ0FBQztBQUMxRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFDLFVBQUUsS0FBWTtJQUMvQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsRCxJQUFJLFFBQVEsR0FBc0IsS0FBTSxDQUFDLEtBQUssQ0FBQztJQUM3QyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDcEIseUJBQXlCO0lBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFFLFFBQVEsQ0FBRSxDQUFDO0lBQ2hDLFdBQVcsQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFFLENBQUM7SUFDeEIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBUYXNre1xuICBpZDogbnVtYmVyO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gIH0gIFxufVxuXG5jbGFzcyBUYXNrTWFuYWdlcntcbnRhc2tzIDogQXJyYXk8VGFzaz47XG5jb25zdHJ1Y3RvciggYXJyYXk6IEFycmF5PFRhc2s+KXtcbnRoaXMudGFza3MgPSBhcnJheTtcbn1cbmFkZCggdGFzazogVGFzayApe1xudGhpcy50YXNrcy5wdXNoKHRhc2spO1xuY29uc29sZS5sb2coIHRoaXMudGFza3MgKTtcbn1cbn1cblxuY2xhc3MgTGlzdFZpZXd7XG4gICAgbGlzdDpIVE1MRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvciggbGlzdGlkOnN0cmluZyApe1xuICAgICAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XG4gICAgfVxuICAgIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgodGFzaykgPT4ge1xuICAgICAgICAgICAgbGV0IGlkID0gdGFzay5pZDtcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzO1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stbmFtZVwiPiR7bmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uLVwiZGVsZXRlXCI+JnRpbWVzOzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxsaT5gO1xuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYXIoKXtcbiAgICAgICAgdGhpcy5saXN0LmlubmVySFRNTCA9Jyc7XG4gICAgfVxufVxuLy9pbml0aWFsaXNlXG52YXIgdGFza2FycmF5ID0gW107XG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcbnZhciBsaXN0dmlldyA9IG5ldyBMaXN0VmlldygndGFzay1saXN0Jyk7XG5cbi8vcmVmZXJlbmNlIHRvIGZvcm1cbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCggZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XG4gICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcbiAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcbiAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xufSk7Il19
