import React, {
  useCallback,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';

import {
  Plus,
  X,
} from 'react-bootstrap-icons';

import { useForm } from 'react-hook-form';

import {
  selectPlayer,
  addPlayer,
  removePlayer,
} from '../../../features/setting/settingSlice';

const Player = () => {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayer);

  const {
    register,
    reset,
    handleSubmit,
  } = useForm({});

  const onAddPlayer = useCallback((values) => {
    dispatch(addPlayer(values));
    reset();
  }, [
    dispatch,
    reset,
  ]);

  const onRemovePlayer = useCallback((id) => {
    dispatch(removePlayer(id));
  }, [
    dispatch,
  ]);

  return (
    <>
      <Form onSubmit={handleSubmit(onAddPlayer)}>
        <Form.Group className="mb-3" controlId="player">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="name"
              {...register("name")}
            />
            <Form.Control
              type="text"
              placeholder="key"
              {...register("key")}
            />
            <Button
              id="add-player"
              type="submit"
              variant="outline-secondary"
            >
              <Plus />
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
      <div
        style={{
          display: "grid",
          rowGap: "1rem"
        }}
      >
        {
          players.map((item) => {
            const { id, name, key } = item;

            return (
              <InputGroup key={id}>
                <InputGroup.Text className="flex-grow-1">{`${name}: ${key}`}</InputGroup.Text>
                <Button
                  variant="outline-secondary"
                  onClick={onRemovePlayer.bind(this, id)}
                >
                  <X />
                </Button>
              </InputGroup>
            );
          })
        }
      </div>
    </>
  );
};

export default Player;
