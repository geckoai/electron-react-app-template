import { Module } from '@packages/router';
import { Component } from './component';

@Module({
  index: true,
  Component,
})
export class IndexModule {}
