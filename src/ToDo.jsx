import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import CheckIcon from "@material-ui/icons/Check";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  strikeTrough: {
    textDecoration: "line-through"
  }
}));

const TableCellStyle = withStyles(theme => ({
  head: {
    backgroundColor: "#0c2b5c",
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const TableRowStyle = withStyles(theme => ({
  root: {
    // backgroundColor: "#f7fcf9",
  }
}))(TableRow);

const ToDoList = () => {
  const classes = useStyles();
  const [state, setState] = useState({ item: "", itemList: [] });
  const [input, setInput] = useState({ inputVal: "", edit: false, id: "" });
  const [updateInput, setUpdateInput] = useState({ update: "" });
  const [checkedItem, setCheckedItem] = useState({ checkedItems: [] });

  useEffect(() => {
    if (state && state.itemList && input && input.id) {
      state.itemList.forEach(elem => {
        if (elem.id === input.id) {
          setUpdateInput({ update: elem.value });
        }
      });
    }
    if (state && state.itemList) {
      const completed = state.itemList.filter(item => item.isChecked === true);
      setCheckedItem({ ...checkedItem, checkedItems: completed });
    }
  }, [input, input.id, state]);

  const handleOnChangeInput = e => {
    let inputValue = e.target.value;
    const element = {
      id: "elem_" + Date.now(),
      value: inputValue,
      isChecked: false
    };
    setState({ ...state, item: element });
    setInput({ ...input, inputVal: inputValue });
  };

  const addBtn = e => {
    e.preventDefault();
    let itemList = state.itemList;
    if (state && state.item && state.item.value.trim() !== "") {
      itemList.push(state.item);
      setState({ itemList: itemList });
      setInput({ ...input, inputVal: "", edit: false });
    }
  };

  const updateItem = id => {
    let updatedList = [];
    state.itemList.forEach(item => {
      if (item.id === id) {
        let obj = {
          id: id,
          value: updateInput.update,
          isChecked: false
        };
        updatedList.push(obj);
      } else {
        updatedList.push(item);
      }
      setState({ itemList: updatedList });
      setInput({ ...input, edit: false });
    });
  };

  const deleteItem = (e, id) => {
    e.preventDefault();
    const list = [...state.itemList];
    const newList = list.filter(item => item.id !== id);
    setState({ itemList: newList });
  };

  const isItemSelected = e => {
    const list = [...state.itemList];
    list.forEach(item => {
      if (item.id === e.target.id) {
        item.isChecked = e.target.checked;
      }
    });
    // const completed = list.filter(item => item.isChecked === true);
    setState({ itemList: list });
    // setCheckedItem({ ...checkedItem, checkedItems: completed });
  };

  console.log(checkedItem, "pppp");

  const renderList = () => {
    if (state && state.itemList) {
      return state.itemList.map((item, index) => {
        return (
          <TableRowStyle
            key={"toDo_" + index}
            className={item.isChecked ? classes.strikeTrough : ""}
          >
            {input && input.edit && item.id === input.id ? (
              <>
                <TableCell align="center" colSpan={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={updateInput.update}
                    onChange={e => {
                      e.preventDefault();
                      setUpdateInput({ update: e.target.value });
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    style={{ cursor: "pointer" }}
                    onClick={e => {
                      updateItem(item.id);
                    }}
                    color="secondary"
                    variant="outlined"
                  >
                    Update
                  </Button>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell padding="checkbox" align="center">
                  <Checkbox
                    checked={item.isChecked}
                    onChange={isItemSelected}
                    name="checkDone"
                    id={item.id}
                  />
                </TableCell>
                <TableCell align="center">{item.value}</TableCell>
                <TableCell align="center">
                  <EditIcon
                    style={{ cursor: "pointer", fontSize: "1rem" }}
                    onClick={e => {
                      item && item.isChecked
                        ? setInput({ inputVal: "", edit: false, id: item.id })
                        : setInput({ inputVal: "", edit: true, id: item.id });
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <DeleteIcon
                    style={{ cursor: "pointer", fontSize: "1rem" }}
                    onClick={e => {
                      deleteItem(e, item.id);
                    }}
                  />
                </TableCell>
              </>
            )}
          </TableRowStyle>
        );
      });
    }
  };

  const renderCompletedList = () => {
    if (checkedItem && checkedItem.checkedItems) {
      return checkedItem.checkedItems.map((check, index) => {
        if (check.isChecked) {
          return (
            <TableRowStyle>
              <TableCell colSpan={3}>{check.value}</TableCell>
            </TableRowStyle>
          );
        }
      });
    }
  };

  return (
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={4}>
        <h1>To Do List</h1>
        <Grid container spacing={2} style={{ marginBottom: 10 }}>
          <Grid xs={10} item>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              onChange={handleOnChangeInput}
              value={input.inputVal}
            />
          </Grid>

          <Grid xs={2} item>
            {" "}
            <Button variant="outlined" color="primary" onClick={e => addBtn(e)}>
              Add
            </Button>{" "}
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRowStyle align="right">
                {/* {input && input.edit ? (
                    <>
                      <TableCellStyle>List</TableCellStyle>
                      <TableCellStyle>Update</TableCellStyle>
                    </>
                  ) : (
                    <>
                      <TableCellStyle align="center">Complete</TableCellStyle>
                      <TableCellStyle>List</TableCellStyle>
                      <TableCellStyle>Edit</TableCellStyle>
                      <TableCellStyle>Delete</TableCellStyle>
                    </>
                  )} */}
                <TableCellStyle align="center">
                  <CheckIcon style={{ fontSize: "1.2rem", marginTop: 10 }} />
                </TableCellStyle>
                <TableCellStyle align="center">Task</TableCellStyle>
                <TableCellStyle align="center">Edit</TableCellStyle>
                <TableCellStyle align="center">Delete</TableCellStyle>
              </TableRowStyle>
            </TableHead>
            <TableBody>{renderList()}</TableBody>
          </Table>
        </TableContainer>

        {checkedItem &&
          checkedItem.checkedItems &&
          checkedItem.checkedItems.length > 0 && (
            <TableContainer component={Paper} style={{ marginTop: 40 }}>
              <Table>
                <TableHead>
                  <TableRow align="right">
                    <TableCell
                      colSpan={4}
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      Completed
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderCompletedList()}</TableBody>
              </Table>
            </TableContainer>
          )}
      </Grid>
      <Grid item xs={2}>
        {" "}
      </Grid>
    </Grid>
  );
};

export default ToDoList;
