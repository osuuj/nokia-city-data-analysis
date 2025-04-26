'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@heroui/react';
import type React from 'react';
import { useState } from 'react';
import { useAuthForm, usePermissions } from '../index';

/**
 * Example component showing how to use the auth feature with HeroUI components
 */
export function AuthExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { isLoading, error, handleLogin, handleRegister, handleLogout, clearError } = useAuthForm({
    onSuccess: () => {
      console.log('Auth operation successful');
    },
    onError: (error) => {
      console.error('Auth operation failed:', error);
    },
  });

  const { can } = usePermissions();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(email, password, name);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Login Example</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" isLoading={isLoading}>
              Login
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Register Example</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" isLoading={isLoading}>
              Register
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Permissions Example</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-2">
            <p>Can read data: {can('read:data') ? 'Yes' : 'No'}</p>
            <p>Can write data: {can('write:data') ? 'Yes' : 'No'}</p>
            <p>Can manage users: {can('manage:users') ? 'Yes' : 'No'}</p>
          </div>
        </CardBody>
        <CardFooter>
          <Button onClick={handleLogout} color="danger">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
