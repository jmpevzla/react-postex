import { useContext, useEffect, useState } from "react"
import { useLocation } from "wouter";
import { stOkLogin } from "@/extras/storage-extras";
import { clearUserAction, userContext } from "@/contexts/userContext";

export default useAuthInit

function useAuthInit() {
  const [, userDispatch] = useContext(userContext)!;
  const [, setLocation] = useLocation();
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (stOkLogin()) {
      return setLocation("/");
    } else {
      userDispatch({
        type: clearUserAction
      })
    }

    setShow(true);
  }, []);

  return show
}