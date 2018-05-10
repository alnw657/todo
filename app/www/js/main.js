(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage(dataname) {
        //check if local storage available
        if (window.localStorage) {
            //local storage  available
            this.status = true;
            this.dataname = dataname;
        }
        else {
            //local storage not available
            this.status = false;
        }
    }
    DataStorage.prototype.read = function (callback) {
        if (this.status) {
            try {
                var data = window.localStorage.getItem(this.dataname);
                callback(JSON.parse(data));
            }
            catch (error) {
                //console.log(error)
                callback(false);
            }
        }
    };
    DataStorage.prototype.store = function (tasks, callback) {
        if (this.status) {
            try {
                var data = JSON.stringify(tasks);
                window.localStorage.setItem(this.dataname, data);
                callback(true);
            }
            catch (error) {
                //console.log(error)
                callback(false);
            }
        }
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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
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
var listview_1 = require("../ts/listview");
var task_1 = require("../ts/task");
//import { Template } from '../ts/template';
var taskmanager_1 = require("../ts/taskmanager");
var datastorage_1 = require("../ts/datastorage");
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
//----INITIALISE CLASSES
//array to store tasks
var taskarray = [];
//storage class
var taskstorage = new datastorage_1.DataStorage('taskdata');
//Task Manager class, pass the task array
var taskmanager = new taskmanager_1.TaskManager(taskarray);
//list view
var listview = new listview_1.ListView('task-list');
//task template
//export var tasktemplate = new Template();
//things to do when app loads
window.addEventListener('load', init);
function init() {
    //read tasks from storage and display
    taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
}
//reference to form
var taskform = document.getElementById('task-form');
//add listener to form
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    //prevent blank tasks form being created
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        taskstorage.store(taskarray, function (result) {
            if (result) {
                taskform.reset();
                listview.clear();
                listview.render(taskarray);
            }
            else {
                //show error message / call error handler
            }
        });
    }
});
//--LIST STUFF
//add listener to list
var listelement = document.getElementById('task-list');
//add listener to list
listelement.addEventListener('click', function (event) {
    var target = event.target;
    var id = getParentId(event.target);
    if (target.getAttribute('data-function') == 'status') {
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager.remove(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
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
    function TaskManager(arrayname) {
        this.tasks = arrayname;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
    };
    TaskManager.prototype.remove = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        });
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        callback();
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id === id) {
                if (task.status == false) {
                    task.status = true;
                    return;
                }
                else {
                    task.status = false;
                }
            }
        });
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            var id1 = parseInt(task1.id);
            var id2 = parseInt(task2.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBR0UscUJBQWEsUUFBZTtRQUMxQixrQ0FBa0M7UUFDbEMsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ3pCLDBCQUEwQjtZQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUMxQjthQUNHO1lBQ0osNkJBQTZCO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBRztnQkFDRCxJQUFJLElBQUksR0FBVSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdELFFBQVEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBRSxDQUFFLENBQUM7YUFDaEM7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDWixvQkFBb0I7Z0JBQ3BCLFFBQVEsQ0FBRSxLQUFLLENBQUMsQ0FBQzthQUNsQjtTQUNGO0lBQ0gsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBRztnQkFDRCxJQUFJLElBQUksR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFFLEtBQUssQ0FBRSxDQUFDO2dCQUMxQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FB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R0FBRyxHQUFVLFFBQVEsQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtnQkFDakQsT0FBTyxDQUFDLENBQUM7YUFDVjtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7Z0JBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDWDtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsQ0FBQzthQUNWO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQW5EQSxBQW1EQyxJQUFBO0FBbkRZLGtDQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFTdG9yYWdle1xyXG4gIHN0YXR1czpib29sZWFuO1xyXG4gIGRhdGFuYW1lOnN0cmluZztcclxuICBjb25zdHJ1Y3RvciggZGF0YW5hbWU6c3RyaW5nICl7XHJcbiAgICAvL2NoZWNrIGlmIGxvY2FsIHN0b3JhZ2UgYXZhaWxhYmxlXHJcbiAgICBpZiggd2luZG93LmxvY2FsU3RvcmFnZSApe1xyXG4gICAgLy9sb2NhbCBzdG9yYWdlICBhdmFpbGFibGVcclxuICAgICAgdGhpcy5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICB0aGlzLmRhdGFuYW1lID0gZGF0YW5hbWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgLy9sb2NhbCBzdG9yYWdlIG5vdCBhdmFpbGFibGVcclxuICAgICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVhZCggY2FsbGJhY2sgKXtcclxuICAgIGlmKCB0aGlzLnN0YXR1cyApe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgbGV0IGRhdGE6c3RyaW5nID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZGF0YW5hbWUpO1xyXG4gICAgICAgIGNhbGxiYWNrKCBKU09OLnBhcnNlKCBkYXRhICkgKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCggZXJyb3IgKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgIGNhbGxiYWNrIChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgc3RvcmUoIHRhc2tzOkFycmF5IDxUYXNrPiwgY2FsbGJhY2sgKXtcclxuICAgIGlmKCB0aGlzLnN0YXR1cyApe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgbGV0IGRhdGE6c3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoIHRhc2tzICk7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGF0YW5hbWUsIGRhdGEgKTtcclxuICAgICAgICBjYWxsYmFjayggdHJ1ZSApO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGNoKCBlcnJvciApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgY2FsbGJhY2soIGZhbHNlICk7IFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcclxuICAgIGxpc3Q6SFRNTEVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvciggbGlzdGlkOnN0cmluZyApe1xyXG4gICAgICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsaXN0aWQgKTtcclxuICAgIH1cclxuICAgIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKCh0YXNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRhc2suaWQ7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXM7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJkZWxldGVcIj4mdGltZXM7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGxpPmA7XHJcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0nJztcclxuICAgIH1cclxufSIsIi8vIGltcG9ydCBtb2R1bGVzIGZyb20gb3RoZXIgZmlsZXNcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tICcuLi90cy9saXN0dmlldyc7XG5pbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XG4vL2ltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnLi4vdHMvdGVtcGxhdGUnO1xuaW1wb3J0IHsgVGFza01hbmFnZXIgfSBmcm9tICcuLi90cy90YXNrbWFuYWdlcic7XG5pbXBvcnQgeyBEYXRhU3RvcmFnZSB9IGZyb20gJy4uL3RzL2RhdGFzdG9yYWdlJztcblxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xuICB3aGlsZSggZWxtLnBhcmVudE5vZGUgKXtcbiAgICBlbG0gPSBlbG0ucGFyZW50Tm9kZTtcbiAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgaWYoIGlkICl7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuLy8tLS0tSU5JVElBTElTRSBDTEFTU0VTXG4vL2FycmF5IHRvIHN0b3JlIHRhc2tzXG52YXIgdGFza2FycmF5OiBBcnJheTxUYXNrPiA9IFtdO1xuLy9zdG9yYWdlIGNsYXNzXG52YXIgdGFza3N0b3JhZ2UgPSBuZXcgRGF0YVN0b3JhZ2UoJ3Rhc2tkYXRhJyk7XG4vL1Rhc2sgTWFuYWdlciBjbGFzcywgcGFzcyB0aGUgdGFzayBhcnJheVxudmFyIHRhc2ttYW5hZ2VyID0gbmV3IFRhc2tNYW5hZ2VyKCB0YXNrYXJyYXkgKTtcbi8vbGlzdCB2aWV3XG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xuLy90YXNrIHRlbXBsYXRlXG4vL2V4cG9ydCB2YXIgdGFza3RlbXBsYXRlID0gbmV3IFRlbXBsYXRlKCk7XG5cblxuLy90aGluZ3MgdG8gZG8gd2hlbiBhcHAgbG9hZHNcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxpbml0KTtcbmZ1bmN0aW9uIGluaXQoKXtcbiAgLy9yZWFkIHRhc2tzIGZyb20gc3RvcmFnZSBhbmQgZGlzcGxheVxuICB0YXNrc3RvcmFnZS5yZWFkKCAoZGF0YSkgPT4ge1xuICAgIGlmKCBkYXRhLmxlbmd0aCA+IDAgKXtcbiAgICAgIGRhdGEuZm9yRWFjaCggKGl0ZW0pID0+IHtcbiAgICAgICAgdGFza2FycmF5LnB1c2goIGl0ZW0gKTtcbiAgICAgIH0pO1xuICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gICAgfVxuICB9KTtcbn1cbi8vcmVmZXJlbmNlIHRvIGZvcm1cbmNvbnN0IHRhc2tmb3JtOkhUTUxGb3JtRWxlbWVudCA9ICg8SFRNTEZvcm1FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XG4vL2FkZCBsaXN0ZW5lciB0byBmb3JtXG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoIGV2ZW50OiBFdmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBsZXQgaW5wdXQ6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xuICBsZXQgdGFza25hbWU6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XG4gIC8vcHJldmVudCBibGFuayB0YXNrcyBmb3JtIGJlaW5nIGNyZWF0ZWRcbiAgaWYoIHRhc2tuYW1lLmxlbmd0aCA+IDAgKXtcbiAgICBsZXQgdGFzazpUYXNrID0gbmV3IFRhc2sodGFza25hbWUpO1xuICAgIHRhc2ttYW5hZ2VyLmFkZCggdGFzayk7XG4gICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSwgKCByZXN1bHQgKSA9PiB7XG4gICAgICBpZiggcmVzdWx0ICl7XG4gICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XG4gICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICAvL3Nob3cgZXJyb3IgbWVzc2FnZSAvIGNhbGwgZXJyb3IgaGFuZGxlclxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuLy8tLUxJU1QgU1RVRkZcbi8vYWRkIGxpc3RlbmVyIHRvIGxpc3RcbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xuLy9hZGQgbGlzdGVuZXIgdG8gbGlzdFxubGlzdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6RXZlbnQpID0+IHtcbiAgbGV0IHRhcmdldDpIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZXZlbnQudGFyZ2V0O1xuICBsZXQgaWQgPSBnZXRQYXJlbnRJZCggKDxOb2RlPiBldmVudC50YXJnZXQpICk7XG5cbiAgaWYoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnc3RhdHVzJyApe1xuICAgIGlmKCBpZCApe1xuICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKGlkLCgpID0+IHtcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSAsICgpID0+IHtcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2RlbGV0ZScpe1xuICAgIGlmKCBpZCApe1xuICAgICAgdGFza21hbmFnZXIucmVtb3ZlKCBpZCwgKCkgPT4ge1xuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJleHBvcnQgY2xhc3MgVGFza3tcclxuICBpZDogc3RyaW5nO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBzdGF0dXM6IGJvb2xlYW47XHJcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XHJcbiAgICB0aGlzLmlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTsgLy9jcmVhdGUgbmV3IGRhdGUgb2JqZWN0XHJcbiAgICB0aGlzLm5hbWUgPSB0YXNrbmFtZTtcclxuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XHJcbiAgfSAgXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2Vye1xyXG4gIHRhc2tzOiBBcnJheTxUYXNrPjsgXHJcbiAgY29uc3RydWN0b3IoYXJyYXluYW1lOiBBcnJheTxUYXNrPil7XHJcbiAgICB0aGlzLnRhc2tzID0gYXJyYXluYW1lO1xyXG4gIH1cclxuICBhZGQodGFzazpUYXNrKXtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gIH1cclxuICByZW1vdmUoaWQ6c3RyaW5nLCBjYWxsYmFjayApe1xyXG4gICAgbGV0IGluZGV4X3RvX3JlbW92ZTpudW1iZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goIChpdGVtOlRhc2ssIGluZGV4Om51bWJlcikgPT4ge1xyXG4gICAgICBpZihpdGVtLmlkICA9PSBpZCl7XHJcbiAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYoIGluZGV4X3RvX3JlbW92ZSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy50YXNrcy5zcGxpY2UoIGluZGV4X3RvX3JlbW92ZSwgMSApO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgY2hhbmdlU3RhdHVzKGlkOnN0cmluZyxjYWxsYmFjayk6dm9pZHtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCggKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkICA9PT0gaWQpe1xyXG4gICAgICAgIGlmKCB0YXNrLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgdGFzay5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBzb3J0KCB0YXNrczpBcnJheTxUYXNrPiApe1xyXG4gICAgdGFza3Muc29ydCgodGFzazEsdGFzazIpID0+IHtcclxuICAgICAgbGV0IGlkMTpudW1iZXIgPSBwYXJzZUludCggdGFzazEuaWQgKTtcclxuICAgICAgbGV0IGlkMjpudW1iZXIgPSBwYXJzZUludCggdGFzazIuaWQgKTtcclxuICAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUgKXtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYoIHRhc2sxLnN0YXR1cyAgPT0gdGFzazIuc3RhdHVzICl7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiJdfQ==
