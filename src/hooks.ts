import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';

export const useStateWithRef = <T>(initialValue: T): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] => {
  const [value, setValue] = useState<T>(initialValue);
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return [value, setValue, ref];
};
