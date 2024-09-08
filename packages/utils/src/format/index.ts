import moment from 'moment';
import React from 'react';
import { Tag } from 'antd';

const DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
const DATE = 'YYYY-MM-DD';
const TIME = 'HH:mm:ss';
const HM = 'HH:mm';

export class Format {
  public static tenPadding(v: number) {
    if (v < 10) {
      return '0' + v;
    }

    return v.toString();
  }

  /**
   * 将数字格式化为时分秒
   * @param v
   */
  public static hms(v: number) {
    if (!isNaN(v)) {
      const s = v % 60;
      const mCount = (v - s) / 60;
      const m = mCount % 60;
      const h = mCount - m;

      if (h) {
        return [
          Format.tenPadding(h),
          Format.tenPadding(m),
          Format.tenPadding(s),
        ].join(`:`);
      }

      return [Format.tenPadding(m), Format.tenPadding(s)].join(`:`);
    }
    return '';
  }

  public static number(v: any): number | undefined {
    if (typeof v === 'number') {
      return v;
    }
    if (v instanceof Number) {
      return Number(v);
    }
    if (!isNaN(v)) {
      return Number(v);
    }
  }

  public static datetime(
    date?: Date | moment.Moment | string | number
  ): string | undefined {
    if (date) {
      if (moment.isMoment(date)) {
        return date.format(DATE_TIME);
      } else if (moment.isDate(date)) {
        return moment(date).format(DATE_TIME);
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return moment(new Date(Number(date))).format(DATE_TIME);
      }
      return moment(new Date(date)).format(DATE_TIME);
    }
  }

  public static time(
    date?: Date | moment.Moment | string | number
  ): string | undefined {
    if (date) {
      if (moment.isMoment(date)) {
        return date.format(TIME);
      } else if (moment.isDate(date)) {
        return moment(date).format(TIME);
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return moment(new Date(Number(date))).format(TIME);
      }
      return moment(new Date(date)).format(TIME);
    }
  }

  public static hmTime(
    date?: Date | moment.Moment | string | number
  ): string | undefined {
    if (date) {
      if (moment.isMoment(date)) {
        return date.format(HM);
      } else if (moment.isDate(date)) {
        return moment(date).format(HM);
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return moment(new Date(Number(date))).format(HM);
      }
      return moment(new Date(date)).format(HM);
    }
  }

  public static toMoment(date?: Date | moment.Moment | string | number) {
    if (date) {
      if (isNaN(date as any)) {
        return moment(new Date(date as any));
      } else {
        return moment(Number(date));
      }
    }
  }

  public static timestamp(date?: Date | moment.Moment | string | number) {
    if (date) {
      if (moment.isMoment(date)) {
        return date.toDate().getTime();
      } else if (moment.isDate(date)) {
        return moment(date).toDate().getTime();
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return moment(new Date(Number(date)))
          .toDate()
          .getTime();
      }
      return moment(new Date(date)).toDate().getTime();
    }
  }

  public static timestampStr(date?: Date | moment.Moment | string | number) {
    if (date) {
      return String(Format.timestamp(date));
    }
  }

  public static date(
    date?: Date | moment.Moment | string | number
  ): string | undefined {
    if (date) {
      if (moment.isMoment(date)) {
        return date.format(DATE);
      } else if (moment.isDate(date)) {
        return moment(date).format(DATE);
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return moment(new Date(Number(date))).format(DATE);
      }
      return moment(new Date(date)).format(DATE);
    }
  }

  public static dateUTC(
    date?: Date | moment.Moment | string | number
  ): string | undefined {
    if (date) {
      if (moment.isMoment(date)) {
        return new Date(date.format(DATE)).toUTCString();
      } else if (moment.isDate(date)) {
        return new Date(moment(date).format(DATE)).toUTCString();
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return new Date(
          moment(new Date(Number(date))).format(DATE)
        ).toUTCString();
      }
      return new Date(moment(new Date(date)).format(DATE)).toUTCString();
    }
  }

  public static dateGMT(
    date?: Date | moment.Moment | string | number
  ): string | undefined {
    if (date) {
      if (moment.isMoment(date)) {
        return new Date(date.format(DATE)).toISOString();
      } else if (moment.isDate(date)) {
        return new Date(moment(date).format(DATE)).toISOString();
      } else if (typeof date === 'number' || !isNaN(date as any)) {
        return new Date(
          moment(new Date(Number(date))).format(DATE)
        ).toISOString();
      }
      return new Date(moment(new Date(date)).format(DATE)).toISOString();
    }
  }

  public static status(
    locale: Array<{
      key: number | string;
      label: string;
      color?: string;
    }>
  ) {
    return (v: any) => {
      const find = locale.find((o) => o.key === v);
      if (find) {
        return React.createElement(Tag, {
          children: find.label,
          color: find.color,
        });
      }
      return null;
    };
  }

  public static type(locale: Array<{ key: number | string; label: string }>) {
    return (v: any) => {
      const find = locale.find((o) => o.key === v);
      if (find) {
        return find.label;
      }
      return null;
    };
  }
}
