import React from 'react';
import { useTable, useSortBy } from 'react-table'
import { ProfileTime } from './ProfileTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserXmark } from '@fortawesome/free-solid-svg-icons';
export function FriendsTable({ columns, data, friends, setFriends, navigate, doToast, deleteState, setDeleteState, deleteTimeout }: any) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable(
        {
          columns,
          data,
        },
        useSortBy
      )
      const firstPageRows = rows.slice(0, 500);
      return (
        <>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? "🔽"
                            : "🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {firstPageRows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{
                          (() => {
                            // Best Plank Time
                            // Total Plank Time
                            if ((cell.render("Cell") as any).props.cell.column.Header === " ") {
                              return <button onClick={() => {
                                if(deleteState) {
                                  fetch('/api/friends', {
                                    method: 'DELETE',
                                    body: JSON.stringify({
                                      name: (cell.render("Cell") as any).props.cell.value
                                    }),
                                    headers: {
                                      "Content-Type": "application/json"
                                    }
                                  });
                                  setDeleteState(false) 
                                  setFriends(friends.filter((e: any) => e.name !== (cell.render("Cell") as any).props.cell.value))
                                  doToast(`Successfully removed ${(cell.render("Cell") as any).props.cell.value} from friends`);
                                  } else {
                                    setDeleteState(true)
                                    deleteTimeout()
                                    doToast(`Are you sure to remove ${(cell.render("Cell") as any).props.cell.value} from friends?`);
                                    
                                  }
                                  
                                }
                                }><FontAwesomeIcon icon={faUserXmark}/></button>
                            }
                            if ((cell.render("Cell") as any).props.cell.column.Header === "Total Plank Time" || (cell.render("Cell") as any).props.cell.column.Header === "Best Plank Time") {
                              const convert =  Number(new Date((cell.render("Cell") as any).props.cell.value * 1000).toISOString().substring(11, 19).replace(/\:/g,''));
                              const result = String(convert).padStart(6, '0')
                              if (result !== '000000') {
                                return <ProfileTime props={result} />;
                              }
                              return '0'
                            }
                            if ((cell.render("Cell") as any).props.cell.column.Header === "Name") {
                              return <span onClick={() => navigate(`/userProfile/?userName=${(cell.render("Cell") as any).props.cell.value}`)}>{(cell.render("Cell") as any).props.cell.value}</span>
                            }
                            // console.log((cell.render("Cell") as any).props.cell.column.Header)
                            // console.log((cell.render("Cell") as any).props.cell.value)
                          return cell.render("Cell")
                          
                    })()}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      );
    }