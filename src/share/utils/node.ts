import { delay } from "./delay";
import { log } from "./log";

class NodeItem<T, K> {
  previous: NodeItem<T, K> | undefined;
  next: NodeItem<T, K> | undefined;
  constructor(readonly key: T, readonly value: K) {}
}

class ListNode<T, K> {
  private head: NodeItem<T, K> | undefined;
  private foot: NodeItem<T, K> | undefined;

  constructor(key?: T, value?: K) {
    if (key !== undefined && value !== undefined) {
      const nodeItem = new NodeItem<T, K>(key, value);
      this.head = nodeItem;
      this.foot = nodeItem;
    }
  }

  deleteItem(item: NodeItem<T, K>): void {
    const pre = this.getPre(item);
    const next = this.getNext(item);
    item.next = undefined;
    item.previous = undefined;
    if (!pre && !next) {
      // 前一个后一个都不存在，当前就只有一个链表项
      this.head = undefined;
      this.foot = undefined;
    } else if (!pre) {
      // 如果前一个不存在，表示当前就是第一个
      this.head = next;
      if (next) {
        next.previous = undefined;
      }
    } else if (!next) {
      // 如果后一个不存在，表示当前就是最后一个
      this.foot = pre;
      pre.next = undefined;
    } else {
      // 两边都有
      pre.next = next;
      next.previous = pre;
    }
  }

  getPre(item: NodeItem<T, K>): NodeItem<T, K> | undefined {
    return item.previous;
  }

  getNext(item: NodeItem<T, K>): NodeItem<T, K> | undefined {
    return item.next;
  }

  add(key: T, value: K, deleteTime?: number): NodeItem<T, K> {
    const item = new NodeItem<T, K>(key, value);
    if (!this.head) {
      // 第一次添加或者前面的删除空了
      this.head = item;
      this.foot = item;
    } else if (this.foot) {
      const lastFoot = this.foot;
      lastFoot.next = item;
      item.previous = lastFoot;
      this.foot = item;
    } else {
      log(`listNode error！`, "error");
    }
    if (deleteTime) {
      delay(deleteTime, () => this.deleteItem(item));
    }
    return item;
  }

  // for map attribute, useful for cache object

  get(key: T): NodeItem<T, K> | undefined {
    let targetItem;
    let tempItem = this.foot;
    while (tempItem && tempItem.key !== key) {
      tempItem = tempItem.previous;
    }
    if (tempItem && tempItem.key === key) {
      targetItem = tempItem;
    }
    return targetItem;
  }

  has(key: T): boolean {
    return !!this.get(key);
  }

  set(key: T, value: K): void {
    this.add(key, value);
  }

  delete(key: T): void {
    const currentItem = this.get(key);
    if (currentItem) {
      this.deleteItem(currentItem);
    }
  }
}

export { ListNode };
