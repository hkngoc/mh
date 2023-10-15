import React, {
  useCallback,
} from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  Modal,
  Form,
  Button,
} from 'react-bootstrap';

import { useForm } from 'react-hook-form';

import { selectSetting } from '../../features/setting/settingSlice';

import {
 addBot,
} from '../../features/bot/botSlice';

const AddBot = ({ onHide, ...rest }) => {
  const {
    hosts,
    players,
  } = useSelector(selectSetting);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const useReset = (fn) => useCallback((...params) => {
    fn?.(...params);
    reset();
  }, [fn]);
  
  const handleHide = useReset(onHide);

  const onSubmit = useCallback((values) => {
    const { host, player, ...rest } = values;

    const h = hosts.find(h => h.id === host);
    const p = players.find(p => p.id === player);

    dispatch(addBot({
      host: h,
      player: p,
      ...rest,
    }));

    onHide?.();
  }, [
    hosts,
    players,
    dispatch,
    onHide,
  ]);

  return (
    <Modal
      {...rest}
      onHide={handleHide}
    >
      <Modal.Header>
        <Modal.Title>
          Bot
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <Form
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group controlId="game" className="mb-3">
            <Form.Control
              placeholder={"game id"}
              {...register("game")}
            />
          </Form.Group>
          <Form.Group controlId="host" className="mb-3">
            <Form.Select {...register("host")}>
              {
                hosts.map((item) => {
                  const { id, host } = item;

                  return (
                    <option value={id} key={id}>{host}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="player">
            <Form.Select {...register("player")}>
              {
                players.map((item) => {
                  const { id, name } = item;
                  return (
                    <option value={id} key={id}>{name}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>
          <Modal.Footer>
            <Button onClick={handleHide} type="reset" variant="secondary">Cancel</Button>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBot;
