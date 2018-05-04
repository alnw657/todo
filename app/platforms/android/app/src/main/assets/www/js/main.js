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
var task_1 = require("../ts/task");
var taskmanager_1 = require("../ts/taskmanager");
var listview_1 = require("../ts/listview");
var datastorage_1 = require("../ts/datastorage");
//initialise
var taskarray = [];
var taskstorage = new datastorage_1.DataStorage('taskdata');
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
    }
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
                    //listview.clear();
                    // listview.render(taskarray);
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
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
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
        callback();
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBR0UscUJBQWEsUUFBZTtRQUMxQixrQ0FBa0M7UUFDbEMsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ3pCLDBCQUEwQjtZQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUMxQjthQUNHO1lBQ0osNkJBQTZCO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBRztnQkFDRCxJQUFJLElBQUksR0FBVSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdELFFBQVEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBRSxDQUFFLENBQUM7YUFDaEM7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDWixvQkFBb0I7Z0JBQ3BCLFFBQVEsQ0FBRSxLQUFLLENBQUMsQ0FBQzthQUNsQjtTQUNGO0lBQ0gsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBRztnQkFDRCxJQUFJLElBQUksR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFFLEtBQUssQ0FBRSxDQUFDO2dCQUMxQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FB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QUksQ0FBQyxVQUFFLEtBQUssRUFBRSxLQUFLO1lBQzNCLElBQUksR0FBRyxHQUFVLFFBQVEsQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDdEMsSUFBSSxHQUFHLEdBQVUsUUFBUSxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUUsQ0FBQztZQUN0QyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFO2dCQUNqRCxPQUFPLENBQUMsQ0FBQzthQUNWO1lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDakQsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNYO1lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxDQUFDO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxrQkFBQztBQUFELENBdkRBLEFBdURDLElBQUE7QUF2RFksa0NBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XHJcbiAgc3RhdHVzOmJvb2xlYW47XHJcbiAgZGF0YW5hbWU6c3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKCBkYXRhbmFtZTpzdHJpbmcgKXtcclxuICAgIC8vY2hlY2sgaWYgbG9jYWwgc3RvcmFnZSBhdmFpbGFibGVcclxuICAgIGlmKCB3aW5kb3cubG9jYWxTdG9yYWdlICl7XHJcbiAgICAvL2xvY2FsIHN0b3JhZ2UgIGF2YWlsYWJsZVxyXG4gICAgICB0aGlzLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgIHRoaXMuZGF0YW5hbWUgPSBkYXRhbmFtZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAvL2xvY2FsIHN0b3JhZ2Ugbm90IGF2YWlsYWJsZVxyXG4gICAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZWFkKCBjYWxsYmFjayApe1xyXG4gICAgaWYoIHRoaXMuc3RhdHVzICl7XHJcbiAgICAgIHRyeXtcclxuICAgICAgICBsZXQgZGF0YTpzdHJpbmcgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5kYXRhbmFtZSk7XHJcbiAgICAgICAgY2FsbGJhY2soIEpTT04ucGFyc2UoIGRhdGEgKSApO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGNoKCBlcnJvciApe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgY2FsbGJhY2sgKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBzdG9yZSggdGFza3M6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApe1xyXG4gICAgaWYoIHRoaXMuc3RhdHVzICl7XHJcbiAgICAgIHRyeXtcclxuICAgICAgICBsZXQgZGF0YTpzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSggdGFza3MgKTtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5kYXRhbmFtZSwgZGF0YSApO1xyXG4gICAgICAgIGNhbGxiYWNrKCB0cnVlICk7XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2goIGVycm9yICl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICBjYWxsYmFjayggZmFsc2UgKTsgXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3RWaWV3e1xyXG4gICAgbGlzdDpIVE1MRWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxpc3RpZCApO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGFzay5pZDtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cztcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cInN0YXR1c1wiPiYjeDI3MTQ7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bGk+YDtcclxuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xuXG5pbXBvcnR7VGFza01hbmFnZXJ9IGZyb20gJy4uL3RzL3Rhc2ttYW5hZ2VyJztcblxuaW1wb3J0e0xpc3RWaWV3fSBmcm9tICcuLi90cy9saXN0dmlldyc7XG5cbmltcG9ydHtEYXRhU3RvcmFnZX0gZnJvbSAnLi4vdHMvZGF0YXN0b3JhZ2UnO1xuXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuXG4vL2luaXRpYWxpc2VcbnZhciB0YXNrYXJyYXk6QXJyYXk8YW55PiA9IFtdO1xudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCd0YXNrZGF0YScpO1xudmFyIHRhc2ttYW5hZ2VyID0gbmV3IFRhc2tNYW5hZ2VyKHRhc2thcnJheSk7XG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgIGxldCB0YXNrZGF0YSA9IHRhc2tzdG9yYWdlLnJlYWQoKGRhdGEpID0+IHtcbiAgICBpZihkYXRhLmxlbmd0aCA+IDApe1xuICAgICAgICBkYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgdGFza2FycmF5LnB1c2goaXRlbSk7IFxuICAgICAgICB9KTtcbiAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgfSAgIFxuICAgfSk7XG4gICAgLy90YXNrZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7dGFza2FycmF5LnB1c2goaXRlbSk7fSk7XG4gICAgLy9saXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbn0pO1xuXG5cbi8vcmVmZXJlbmNlIHRvIGZvcm1cbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCggZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XG5pZiAodGFza25hbWUubGVuZ3RoID4gMCl7XG4gICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcbiAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcbiAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZihyZXN1bHQpeyBcbiAgICAgICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbn1cbn0pO1xuXG5mdW5jdGlvbiBnZXRQYXJlbnRJZChlbG06Tm9kZSl7XG4gICAgd2hpbGUoZWxtLnBhcmVudE5vZGUpe1xuICAgICAgICBlbG0gPSBlbG0ucGFyZW50Tm9kZTtcbiAgICAgICAgbGV0IGlkOnN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+IGVsbSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBpZihpZCl7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xubGlzdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChldmVudDpFdmVudCkgPT4ge1xuICAgIGxldCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGV2ZW50LnRhcmdldDtcbiAgICBsZXQgaWQgPSBnZXRQYXJlbnRJZCggPE5vZGU+IGV2ZW50LnRhcmdldCk7XG4gICAgICBjb25zb2xlLmxvZyhpZCk7XG4gICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpPT0gJ3N0YXR1cycpe1xuICAgICAgICBpZihpZCl7XG4gICAgICAgICAgICB0YXNrbWFuYWdlci5jaGFuZ2VTdGF0dXMoaWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcbiAgICAgICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgIC8vIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnZGVsZXRlJyl7XG4gICAgaWYoIGlkICl7XG4gICAgICB0YXNrbWFuYWdlci5kZWxldGUoIGlkLCAoKSA9PiB7XG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gICAgICAgICAgICAgICAvL2xpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAvLyBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgIFxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiZXhwb3J0IGNsYXNzIFRhc2t7XHJcbiAgaWQ6IHN0cmluZztcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBib29sZWFuO1xyXG4gIGNvbnN0cnVjdG9yKHRhc2tuYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7IC8vY3JlYXRlIG5ldyBkYXRlIG9iamVjdFxyXG4gICAgdGhpcy5uYW1lID0gdGFza25hbWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xyXG4gIH0gIFxyXG59XHJcbiIsImltcG9ydCB7VGFza30gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXJ7XHJcbnRhc2tzIDogQXJyYXk8VGFzaz47XHJcbmNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xyXG50aGlzLnRhc2tzID0gYXJyYXk7XHJcbn1cclxuYWRkKCB0YXNrOiBUYXNrICl7XHJcbnRoaXMudGFza3MucHVzaCh0YXNrKTtcclxudGhpcy5zb3J0KHRoaXMudGFza3MpO1xyXG59XHJcbiAgICBcclxuICAgIGRlbGV0ZSggaWQ6c3RyaW5nLCBjYWxsYmFjayl7XHJcbiAgICAgICAgbGV0IGluZGV4X3RvX3JlbW92ZTpudW1iZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy50YXNrcy5mb3JFYWNoKChpdGVtOlRhc2ssIGluZGV4Om51bWJlcik9PntcclxuICAgICAgICAgICBpZihpdGVtLmlkID09IGlkKXtcclxuICAgICAgICAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XHJcbiAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL2RlbGV0ZSB0aGUgaXRlbSB3aXRoIHNwZWNpZmllbGQgaW5kZXhcclxuICAgICAgICBpZihpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRoaXMudGFza3Muc3BsaWNlKGluZGV4X3RvX3JlbW92ZSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2hhbmdlU3RhdHVzKCBpZDpTdHJpbmcsIGNhbGxiYWNrICk6dm9pZHtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICAgICB0aGlzLnNvcnQodGhpcy50YXNrcyk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gICAgc29ydCh0YXNrczpBcnJheTxUYXNrPil7XHJcbiAgICAgICAgdGFza3Muc29ydCgoIHRhc2sxLCB0YXNrMiApID0+e1xyXG4gICAgICBsZXQgaWQxOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMS5pZCApO1xyXG4gICAgICBsZXQgaWQyOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMi5pZCApO1xyXG4gICAgICBpZiggdGFzazEuc3RhdHVzID09IHRydWUgJiYgdGFzazIuc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSBmYWxzZSAmJiB0YXNrMi5zdGF0dXMgPT0gdHJ1ZSApe1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiggdGFzazEuc3RhdHVzICA9PSB0YXNrMi5zdGF0dXMgKXtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
