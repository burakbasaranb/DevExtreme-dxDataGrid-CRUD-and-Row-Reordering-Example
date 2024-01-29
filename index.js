/*
 * Author: Burak Basaran
 * Email:  burak@burakbasaran.com
 * Date:   2024-01-27
 * 
 * This is the main JavaScript file for a web page that displays a DevExpress DataGrid.
 *
 * The grid is configured with several features:
 * - Editing in a popup mode with icons, allowing updating, deleting, and adding rows.
 * - Borders around the grid cells.
 * - A fixed height of 440 pixels.
 * - A data source from the `tasks` array.
 * - A unique key expression set to 'ID'.
 * - Virtual scrolling mode for performance optimization with large data sets.
 * - Disabled sorting.
 * - Enabled row reordering. When a row is reordered, the `onReorder` function is called. This function:
 *   - Finds the new and old positions of the reordered row in the `tasks` array.
 *   - Updates the `tasks` array to reflect the new order.
 *   - Refreshes the grid.
 *   - Creates a new array `newOrder` of the reordered IDs.
 *   - Sends this new order to the server using `setRowOrders(newOrder.join())`.
 *
 *
 * The grid is initialized when the `get_gridContainer` function is called.
 */

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
    height: 440,
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

        // 1. refresh the list with new order
        e.component.refresh();
        
        //-----------------------------------------
        // 2. Then send the new order to the server
        
        // Create IDs array
        var newOrder = [];
        for (var i = 0; i < tasks.length; i++) {
            newOrder.push(tasks[i].ID);
        }
        //send IDs to server
        setRowOrders(newOrder.join());
        //-----------------------------------------
        
      },
    },
    onEditingStart() {
      //submitEvent("EditingStart"); 
    },
    onInitNewRow() {
      submitEvent("InitNewRow");
    },
    onRowInserting(e) {
      submitEvent("RowInserting", e);
    },
    onRowInserted() {
      submitEvent("RowInserted");
    },
    onRowUpdating(e) {
      submitEvent("RowUpdating", e);
    },
    onRowUpdated() {
      submitEvent("RowUpdated");
    },
    onRowRemoving(e) {
      submitEvent("RowRemoving", e);
    },
    onRowRemoved() {
      submitEvent("RowRemoved");
    },
    //onSaving(e) {
    //    submitEvent('Saving', e);
    //},
    onSaved() {
      submitEvent("Saved");
    },
    onEditCanceling() {
      submitEvent("EditCanceling");
    },
    onEditCanceled() {
      submitEvent("EditCanceled");
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
function submitEvent(eventName, e) {
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
