// define locale
DevExpress.localization.locale("en-EN");
//------------------------------------------------------------------------------------------
get_gridContainer();
//------------------------------------------------------------------------------------------
function get_gridContainer() {

  $('#gridContainer').dxDataGrid({
    editing: {
      mode: "popup",
      useIcons: true,
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    showBorders: true,
    dheight: 440,
    dataSource: tasks,
    keyExpr: 'ID',
    scrolling: {
      mode: 'virtual',
    },
    sorting: {
      mode: 'none',
    },
    rowDragging: {
      allowReordering: true,
      onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = tasks.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
        const fromIndex = tasks.findIndex((item) => item.ID === e.itemData.ID);

        tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, e.itemData);

        //-----------------------------------------
        // Create IDs array
        var newOrder = [];
        for (var i = 0; i < tasks.length; i++) {
            newOrder.push(tasks[i].ID);
        }
        //send IDs to server
        setRowOrders(newOrder.join());
        //-----------------------------------------
        e.component.refresh();
      },
    },
    onEditingStart() {
      //logEvent("EditingStart"); 
    },
    onInitNewRow() {
      logEvent("InitNewRow");
    },
    onRowInserting(e) {
      logEvent("RowInserting", e);
    },
    onRowInserted() {
      logEvent("RowInserted");
    },
    onRowUpdating(e) {
      logEvent("RowUpdating", e);
    },
    onRowUpdated() {
      logEvent("RowUpdated");
    },
    onRowRemoving(e) {
      logEvent("RowRemoving", e);
    },
    onRowRemoved() {
      logEvent("RowRemoved");
    },
    //onSaving(e) {
    //    logEvent('Saving', e);
    //},
    onSaved() {
      logEvent("Saved");
    },
    onEditCanceling() {
      logEvent("EditCanceling");
    },
    onEditCanceled() {
      logEvent("EditCanceled");
    },
    columns: [{
      dataField: 'ID',
      width: 55,
    }, {
      dataField: 'Owner',
      lookup: {
        dataSource: employees,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      width: 150,
    }, {
      dataField: 'AssignedEmployee',
      caption: 'Assignee',
      lookup: {
        dataSource: employees,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      width: 150,
    }, 'Subject'],
  }).dxDataGrid('instance');
  //-----------------------------------------------------------------------------------------
}
//---------------------------------------------
function logEvent(eventName, e) {
  //console.log(eventName);
  //console.log(e);
  
  //Insert
  if (eventName == "RowInserting") {
     var d = e.data;
     var model = {
      TransactionID: "RowInserting",
          ID: 0,
          Owner: d.Owner,
          AssignedEmployee: d.AssignedEmployee,
          Subject: d.Subject,
      };
      RowSubmit(model);
    }
  //Edit
  if (eventName == "RowUpdating") {
      var n = e.newData; // new data
      var o = e.oldData; // old data
     var model = {
      TransactionID: "RowUpdating",
          ID: o.ID,
          Owner: (n.Owner != null ? n.Owner : o.Owner),
          AssignedEmployee: (n.AssignedEmployee != null ? n.AssignedEmployee : o.AssignedEmployee),
          Subject: (n.Subject != null ? n.Subject : o.Subject),
      };
      RowSubmit(model);
    }
  //Delete
  if (eventName == "RowRemoving") {
    var d = e.data;
     var model = {
          TransactionID: "RowRemoving",
          ID: d.ID,
          Owner: d.Owner,
          AssignedEmployee: d.AssignedEmployee,
          Subject: d.Subject,
      };

      RowSubmit(model);
  }
}
//------------------------------------------------------------------------------------------
function RowSubmit(model) {

  console.log(model);
  //----------------------------------------------------------------------------------------
  var myDialog = DevExpress.ui.dialog.custom({
    title: model.TransactionID+": Submitted Row Data",
    messageHtml: JSON.stringify(model),
    width: 400,
  });
  myDialog.show();
  //----------------------------------------------------------------------------------------
  // post your ids to the server
  //$.ajax({
  //  cache: false,
  //  url: "/RowSubmit",
  //  data: model,
  //  type: "post",
  //  success: function (result) {  
  //    console.log(result);
  //    return true;
  //  },
  //  error: function (e) {
  //    console.log(e);
  //    return false;
  //  },
  //});
}
//------------------------------------------------------------------------------------------
function setRowOrders(IDs) {
  var data = {
    IDs: IDs,
  };
  console.log(data);
  //----------------------------------------------------------------------------------------
  var myDialog = DevExpress.ui.dialog.custom({
    title: "Rows' sorting IDs have been set",
    messageHtml: IDs,
    width: 400,
  });
  myDialog.show();
  //----------------------------------------------------------------------------------------
  // post your ids to the server
  //$.ajax({
  //  cache: false,
  //  url: "/setRowOrders",
  //  data: data,
  //  type: "post",
  //  success: function (result) {
  //  },
  //});
}
