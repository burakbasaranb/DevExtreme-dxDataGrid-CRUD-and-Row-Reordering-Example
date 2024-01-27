# DevExtreme dxDataGrid CRUD and Row Reordering Example

## Forms
```
editing: {
      mode: "popup",
      useIcons: true,
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
```

### ReOrder

```
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
```