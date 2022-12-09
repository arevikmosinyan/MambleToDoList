import './App.css';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Checkbox from '@material-ui/core/Checkbox';
import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
  root: {
    '& .MuiInputBase-input': {
      border: '2px solid orange',
      borderRadius: 2,
    },
    width: '100%',
  },
  containerOfTaskTitle: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  taskText: {
    alignItems: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
  wrapperOfAllExceptHideCompleted: {
    margin: 'auto',
    width: '60%',
  },
  addButton: {
    padding: 0,
    textTransform: 'capitalize',
    height: 50,
    margin: 10,
    flex: 0.2,
    flexGrow: 0,
  },
  checkHideCompleted: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 50,
  },
  li: {
    border: '1 solid black',
    borderRadius: 10,
    listStyle: 'none',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxShadow: '0 1.5px 3px 0 gray',
    minHeight: 20,
  },
  todotext: {
    paddingRight: 17,
    paddingBottom: 5,
    overflowWrap: 'break-word',
    overflowX: 'clip',
  },
  wrapperOfAllExceptHideCompletedAndTasktext: {
    display: 'flex',
  },
  wrapOfCheckboxAndTodoText: {
    width: '94%',
    display: 'inline-flex',
    alignItems: 'center',
  },
  containerOfTextfieldAndButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  clearIcon: {
    marginRight: 7,
  },
  textField: {
    flex: 0.8,
    flexGrow: 1,
  },
  ul: { padding: 0 },
  '@media (max-width:810px)': {
    containerOfTextfieldAndButton: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    addButton: {
      width: 40,
      minHeight: 30,
    },
    textField: {
      width: '100%',
    },
  },
});

function App() {
  const classes = useStyles();
  const [todotext, setTodoText] = useState('');
  const [todolist, setTodoList] = useState([]);
  const [open, setOpen] = useState(false);
  const [todoId, setTodoId] = useState('');
  const inputRef = useRef(null);
  const [initial, setInitial] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTodoList(JSON.parse(localStorage.getItem('todolist') || []));
  }, []);

  useEffect(() => {
    if (!initial) {
      setInitial(true);
    } else {
      localStorage.setItem('todolist', JSON.stringify(todolist));
    }
  }, [todolist]);

  function onChange(e) {
    setTodoText(e.target.value);
  }

  function onAdd() {
    setTodoList(todolist.concat(todolist.splice(0, 0, { id: uuid(), text: todotext, checked: false })));
    setTodoText('');
  }

  function onRemoveClick(id) {
    setTodoId(id);
    setOpen(true);
  }

  function onConfirmDeleteItem() {
    setTodoList(todolist.filter((elem) => elem.id !== todoId));
    setOpen(false);
  }

  function onToggleChecking(id) {
    setTodoList(
      todolist.map((el) => {
        if (el.id === id) {
          return { ...el, checked: el.checked ? false : true };
        }
        return el;
      }),
    );
  }

  function onHideCompleted() {
    setTodoList(todolist.filter((elem) => !elem.checked));
  }

  return (
    <>
      <div className={classes.checkHideCompleted}>
        <Checkbox color='primary' inputProps={{ 'aria-label': 'secondary checkbox' }} onClick={onHideCompleted} />
        <p> Hide completed </p>
      </div>
      <div className={classes.wrapperOfAllExceptHideCompleted}>
        <div className={classes.containerOfTaskTitle}>
          <p className={classes.taskText}>Task</p>
        </div>

        <div className={classes.wrapperOfAllExceptHideCompletedAndTasktext}>
          <form className={classes.root} noValidate autoComplete='off'>
            <div className={classes.containerOfTextfieldAndButton}>
              <TextField
                onKeyDown={(e) => (e.key === 'Enter' ? onAdd() : null)}
                border={2}
                value={todotext}
                ref={inputRef}
                inputProps={{ maxLength: 55 }}
                className={classes.textField}
                id='input-with-icon-textfield'
                placeholder='Write here'
                variant='outlined'
                helperText={todotext.length > 54 ? 'Task content can contain max 54 characters.' : ''}
                onChange={onChange}
              />
              <Button
                disabled={todotext.length > 54}
                variant='contained'
                color='primary'
                className={classes.addButton}
                onClick={(e) => onAdd(e)}>
                Add
              </Button>
            </div>
            <ul className={classes.ul}>
              {todolist.map((elem) => {
                return (
                  <li key={elem.id} className={classes.li} style={{ color: elem.checked ? 'grey' : 'black' }}>
                    <div className={classes.wrapOfCheckboxAndTodoText}>
                      <div id='checkboxOfLi'>
                        <Checkbox
                          color='primary'
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                          onClick={() => onToggleChecking(elem.id)}
                        />
                      </div>
                      <div id='todoText' className={classes.todotext}>
                        {elem.text}
                      </div>
                    </div>
                    <div className={classes.clearIcon}>
                      <ClearIcon onClick={() => onRemoveClick(elem.id)} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </form>

          <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
            <DialogTitle id='alert-dialog-title'>{'Are you sure you want to delete?'}</DialogTitle>
            <DialogActions>
              <Button onClick={onConfirmDeleteItem} color='primary'>
                Yes
              </Button>
              <Button onClick={handleClose} color='primary'>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default App;
