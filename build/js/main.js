(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array, callback) {
        var data = JSON.stringify(array);
        var storestatus = this.storage.setItem('taskdata', data);
        if (storestatus) {
            callback(true);
        }
        else {
            callback(false);
        }
    };
    DataStorage.prototype.read = function (callback) {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        callback(array);
    };
    return DataStorage;
}());
exports.DataStorage = DataStorage;
},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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
exports.ListView = ListView;
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var task_1 = require("../ts/task");
var taskmanager_1 = require("../ts/taskmanager");
var listview_1 = require("../ts/listview");
var datastorage_1 = require("../ts/datastorage");
//initialise
var taskarray = [];
var taskstorage = new datastorage_1.DataStorage();
var taskmanager = new taskmanager_1.TaskManager(taskarray);
var listview = new listview_1.ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
    //taskdata.forEach((item) => {taskarray.push(item);});
    //listview.render(taskarray);
});
//reference to form
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    // console.log(taskname);
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        listview.clear();
    }
    ;
    taskstorage.store(taskarray, function (result) {
        if (result) {
            taskform.reset();
            listview.clear();
            listview.render(taskarray);
        }
        else {
            //error to do with storage
        }
    });
    listview.render(taskarray);
});
function getParentId(elm) {
    while (elm.parentNode) {
        elm = elm.parentNode;
        var id = elm.getAttribute('id');
        if (id) {
            return id;
        }
    }
    return null;
}
var listelement = document.getElementById('task-list');
listelement.addEventListener('click', function (event) {
    var target = event.target;
    var id = getParentId(event.target);
    console.log(id);
    if (target.getAttribute('data-function') == 'status') {
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
                //listview.clear();
                // listview.render(taskarray);
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager["delete"](id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
                //listview.clear();
                // listview.render(taskarray);
            });
        }
    }
});
},{"../ts/datastorage":1,"../ts/listview":2,"../ts/task":4,"../ts/taskmanager":5}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString(); //create new date object
        this.name = taskname;
        this.status = false;
    }
    return Task;
}());
exports.Task = Task;
},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
                console.log(task.id);
                if (task.status == false) {
                    task.status = true;
                }
                else {
                    task.status = false;
                }
            }
        });
        callback();
    };
    TaskManager.prototype["delete"] = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        });
        //delete the item with specifield index
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            if (task1.status == true && task2.status == false) {
                return 1;
            }
            if (task1.status == false && task2.status == true) {
                return -1;
            }
            if (task1.status == task2.status) {
                return 0;
            }
        });
    };
    return TaskManager;
}());
exports.TaskManager = TaskManager;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUk7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBRyxXQUFXLEVBQUM7WUFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7YUFDRztZQUNBLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFDRywwQkFBSSxHQUFKLFVBQUssUUFBUTtRQUNULElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFDTCxrQkFBQztBQUFELENBcEJKLEFBb0JLLElBQUE7QUFwQlEsa0NBQVc7Ozs7QUNBeEI7SUFFSSxrQkFBYSxNQUFhO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBRSxNQUFNLENBQUUsQ0FBQztJQUNsRCxDQUFDO0lBQ0QseUJBQU0sR0FBTixVQUFRLEtBQWlCO1FBQXpCLGlCQWlCQztR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QUM1QixPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQW5EQSxBQW1EQyxJQUFBO0FBbkRZLGtDQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFTdG9yYWdle1xyXG4gICAgc3RvcmFnZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICAgIH1cclxuICAgIHN0b3JlKCBhcnJheTpBcnJheSA8VGFzaz4sIGNhbGxiYWNrICl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSggYXJyYXkpO1xyXG4gICAgICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpO1xyXG4gICAgICAgIGlmKHN0b3Jlc3RhdHVzKXtcclxuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmVhZChjYWxsYmFjayl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICB9IiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3RWaWV3e1xyXG4gICAgbGlzdDpIVE1MRWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxpc3RpZCApO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGFzay5pZDtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cztcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cInN0YXR1c1wiPiYjeDI3MTQ7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbi1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bGk+YDtcclxuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xuXG5pbXBvcnR7VGFza01hbmFnZXJ9IGZyb20gJy4uL3RzL3Rhc2ttYW5hZ2VyJztcblxuaW1wb3J0e0xpc3RWaWV3fSBmcm9tICcuLi90cy9saXN0dmlldyc7XG5cbmltcG9ydHtEYXRhU3RvcmFnZX0gZnJvbSAnLi4vdHMvZGF0YXN0b3JhZ2UnO1xuXG4vL2luaXRpYWxpc2VcbnZhciB0YXNrYXJyYXk6QXJyYXk8YW55PiA9IFtdO1xudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcbnZhciBsaXN0dmlldyA9IG5ldyBMaXN0VmlldygndGFzay1saXN0Jyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgbGV0IHRhc2tkYXRhID0gdGFza3N0b3JhZ2UucmVhZCgoZGF0YSkgPT4ge1xuICAgIGlmKGRhdGEubGVuZ3RoID4gMCl7XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICB0YXNrYXJyYXkucHVzaChpdGVtKTsgXG4gICAgICAgIH0pO1xuICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICB9ICAgXG4gICB9KTtcbiAgICAvL3Rhc2tkYXRhLmZvckVhY2goKGl0ZW0pID0+IHt0YXNrYXJyYXkucHVzaChpdGVtKTt9KTtcbiAgICAvL2xpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xufSk7XG5cblxuLy9yZWZlcmVuY2UgdG8gZm9ybVxuY29uc3QgdGFza2Zvcm0gPSAoPEhUTUxGb3JtRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stZm9ybScpKTtcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcbiAgbGV0IHRhc2tuYW1lOnN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XG4gICAgaWYgKHRhc2tuYW1lLmxlbmd0aCA+IDApe1xuICAgICAgICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcbiAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcbiAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICBcbiAgICB9O1xuICAgXG4gICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmKHJlc3VsdCl7IFxuICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xuICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlXG4gICAgICAgIH1cbiAgICB9ICk7XG4gICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG59KTtcblxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xuICAgIHdoaWxlKGVsbS5wYXJlbnROb2RlKXtcbiAgICAgICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XG4gICAgICAgIGxldCBpZDpzdHJpbmcgPSAoPEhUTUxFbGVtZW50PiBlbG0pLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBsaXN0ZWxlbWVudDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQ6RXZlbnQpID0+IHtcbiAgICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7XG4gICAgbGV0IGlkID0gZ2V0UGFyZW50SWQoIDxOb2RlPiBldmVudC50YXJnZXQpO1xuICAgICAgY29uc29sZS5sb2coaWQpO1xuICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdzdGF0dXMnKXtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKGlkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XG4gICAgICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL2xpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAvLyBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdkZWxldGUnKXtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgdGFza21hbmFnZXIuZGVsZXRlKGlkLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgLy9saXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgICAgICAgLy8gbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImV4cG9ydCBjbGFzcyBUYXNre1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHN0YXR1czogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcih0YXNrbmFtZTogc3RyaW5nKXtcclxuICAgIHRoaXMuaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpOyAvL2NyZWF0ZSBuZXcgZGF0ZSBvYmplY3RcclxuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcclxuICB9ICBcclxufVxyXG4iLCJpbXBvcnQge1Rhc2t9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2Vye1xyXG50YXNrcyA6IEFycmF5PFRhc2s+O1xyXG5jb25zdHJ1Y3RvciggYXJyYXk6IEFycmF5PFRhc2s+KXtcclxudGhpcy50YXNrcyA9IGFycmF5O1xyXG59XHJcbmFkZCggdGFzazogVGFzayApe1xyXG50aGlzLnRhc2tzLnB1c2godGFzayk7XHJcbnRoaXMuc29ydCh0aGlzLnRhc2tzKTtcclxufVxyXG4gICAgY2hhbmdlU3RhdHVzKCBpZDpTdHJpbmcsIGNhbGxiYWNrICk6dm9pZHtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCB0YXNrLmlkICk7XHJcbiAgICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoIGlkOnN0cmluZywgY2FsbGJhY2spe1xyXG4gICAgICAgIGxldCBpbmRleF90b19yZW1vdmU6bnVtYmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMudGFza3MuZm9yRWFjaCgoaXRlbTpUYXNrLCBpbmRleDpudW1iZXIpPT57XHJcbiAgICAgICAgICAgaWYoaXRlbS5pZCA9PSBpZCl7XHJcbiAgICAgICAgICAgICAgIGluZGV4X3RvX3JlbW92ZSA9IGluZGV4O1xyXG4gICAgICAgICAgIH0gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9kZWxldGUgdGhlIGl0ZW0gd2l0aCBzcGVjaWZpZWxkIGluZGV4XHJcbiAgICAgICAgaWYoaW5kZXhfdG9fcmVtb3ZlICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnRhc2tzLnNwbGljZShpbmRleF90b19yZW1vdmUsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNvcnQodGhpcy50YXNrcyk7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHNvcnQodGFza3M6QXJyYXk8VGFzaz4pe1xyXG4gICAgICAgIHRhc2tzLnNvcnQoKCB0YXNrMSwgdGFzazIgKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0YXNrMS5zdGF0dXMgPT0gdHJ1ZSAmJiB0YXNrMi5zdGF0dXMgPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGFzazEuc3RhdHVzID09IHRhc2syLnN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
