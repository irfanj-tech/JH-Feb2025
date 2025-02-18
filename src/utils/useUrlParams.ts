import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useUrlParams() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const parsedParams: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      parsedParams[key] = value;
    });
    setParams(parsedParams);
  }, [location.search]);

  const updateUrlParams = (params: { key: string; value: string }[]) => {
    const queryParams = new URLSearchParams(location.search);

    params.forEach((param) => {
      queryParams.set(param.key, param.value);
    });

    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  return { params, updateUrlParams };
}

export default useUrlParams;
