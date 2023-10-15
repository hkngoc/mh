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
  selectHost,
  addHost,
  removeHost,
} from '../../../features/setting/settingSlice';

const Host = () => {
  const dispatch = useDispatch();
  const hosts = useSelector(selectHost);

  const {
    register,
    reset,
    handleSubmit,
  } = useForm({});

  const onAddHost = useCallback((values) => {
    const { host } = values;

    dispatch(addHost(host));
    reset();
  }, [
    dispatch,
    reset,
  ]);

  const onRemoveHost = useCallback((id) => {
    dispatch(removeHost(id));
  }, [
    dispatch,
  ]);

  return (
    <>
      <Form onSubmit={handleSubmit(onAddHost)}>
        <Form.Group className="mb-3" controlId="host">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="url"
              {...register("host")}
            />
            <Button
              id="add-host"
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
          hosts.map((item) => {
            const { id, host } = item;

            return (
              <InputGroup key={id}>
                <InputGroup.Text className="flex-grow-1">{host}</InputGroup.Text>
                <Button
                  variant="outline-secondary"
                  onClick={onRemoveHost.bind(this, id)}
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

export default Host;
