import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// 🔹 Handle all student operations
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const studentId = searchParams.get('studentId');

    // Handle promotion history requests
    if (action === 'promotion-history') {
      const history = await prisma.promotionHistory.findMany({
        where: studentId ? { studentId: parseInt(studentId) } : {},
        include: {
          student: {
            select: {
              name: true,
              admissionNumber: true
            }
          }
        },
        orderBy: { promotedAt: 'desc' }
      });

      return NextResponse.json({ success: true, history });
    }

    // Default: get all students
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// 🔹 POST new student
export async function POST(req) {
  try {
    const data = await req.json();

    const newStudent = await prisma.student.create({
      data: {
        admissionNumber: data.admissionNumber,
        name: data.name,
        form: data.form,
        stream: data.stream,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        enrollmentDate: new Date(data.enrollmentDate),
        kcpeMarks: data.kcpeMarks ? parseInt(data.kcpeMarks) : null,
        previousSchool: data.previousSchool,
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        emergencyContact: data.emergencyContact,
        address: data.address,
        medicalInfo: data.medicalInfo,
        hobbies: data.hobbies,
        academicPerformance: data.academicPerformance,
        attendance: data.attendance,
        disciplineRecord: data.disciplineRecord,
        status: data.status || "Active",
      },
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT update student
// 🔹 PUT update student
// 🔹 PUT update student
export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    console.log('📝 Update request for student ID:', id);
    console.log('📝 Update data:', updateData);

    // Check if student exists first
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Only check for admission number conflict if it's being changed
    if (updateData.admissionNumber && updateData.admissionNumber !== existingStudent.admissionNumber) {
      const duplicateStudent = await prisma.student.findFirst({
        where: {
          admissionNumber: updateData.admissionNumber,
          id: { not: parseInt(id) } // Exclude current student
        }
      });

      if (duplicateStudent) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Admission number ${updateData.admissionNumber} already exists for student: ${duplicateStudent.name}` 
          }, 
          { status: 400 }
        );
      }
    }

    // Prepare the update data - only include fields that are provided
    const updatePayload = {};
    
    // Add fields only if they are provided in the update
    if (updateData.admissionNumber !== undefined) updatePayload.admissionNumber = updateData.admissionNumber;
    if (updateData.name !== undefined) updatePayload.name = updateData.name;
    if (updateData.form !== undefined) updatePayload.form = updateData.form;
    if (updateData.stream !== undefined) updatePayload.stream = updateData.stream;
    if (updateData.gender !== undefined) updatePayload.gender = updateData.gender;
    if (updateData.dateOfBirth !== undefined) updatePayload.dateOfBirth = new Date(updateData.dateOfBirth);
    if (updateData.enrollmentDate !== undefined) updatePayload.enrollmentDate = new Date(updateData.enrollmentDate);
    if (updateData.kcpeMarks !== undefined) updatePayload.kcpeMarks = updateData.kcpeMarks ? parseInt(updateData.kcpeMarks) : null;
    if (updateData.previousSchool !== undefined) updatePayload.previousSchool = updateData.previousSchool;
    if (updateData.parentName !== undefined) updatePayload.parentName = updateData.parentName;
    if (updateData.parentEmail !== undefined) updatePayload.parentEmail = updateData.parentEmail;
    if (updateData.parentPhone !== undefined) updatePayload.parentPhone = updateData.parentPhone;
    if (updateData.emergencyContact !== undefined) updatePayload.emergencyContact = updateData.emergencyContact;
    if (updateData.address !== undefined) updatePayload.address = updateData.address;
    if (updateData.medicalInfo !== undefined) updatePayload.medicalInfo = updateData.medicalInfo;
    if (updateData.hobbies !== undefined) updatePayload.hobbies = updateData.hobbies;
    if (updateData.academicPerformance !== undefined) updatePayload.academicPerformance = updateData.academicPerformance;
    if (updateData.attendance !== undefined) updatePayload.attendance = updateData.attendance;
    if (updateData.disciplineRecord !== undefined) updatePayload.disciplineRecord = updateData.disciplineRecord;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;

    console.log('📝 Final update payload:', updatePayload);

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: updatePayload,
    });

    return NextResponse.json({ 
      success: true, 
      student: updatedStudent,
      message: "Student updated successfully" 
    });

  } catch (error) {
    console.error("❌ PUT Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: "This admission number already exists for another student. Please use a different admission number." 
        }, 
        { status: 400 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Student not found" 
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update student" }, 
      { status: 500 }
    );
  }
}

// 🔹 DELETE student
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await prisma.student.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PATCH promote/graduate class
// 🔹 PATCH promote/graduate class
export async function PATCH(req) {
  try {
    const data = await req.json();
    const { form, action } = data;

    if (action === 'graduate') {
      // Existing graduation logic remains the same
      const updatedStudents = await prisma.student.updateMany({
        where: { 
          form: form,
          status: { in: ["Active", "Transferred"] }
        },
        data: {
          status: "Graduated"
        },
      });

      const studentsToGraduate = await prisma.student.findMany({
        where: { 
          form: form,
          status: "Graduated"
        }
      });

      if (studentsToGraduate.length > 0) {
        const promotionRecords = studentsToGraduate.map(student => ({
          studentId: student.id,
          fromForm: student.form,
          toForm: 'Graduated',
          fromStream: student.stream,
          toStream: student.stream,
          promotedBy: 'System'
        }));

        await prisma.promotionHistory.createMany({
          data: promotionRecords
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: `${updatedStudents.count} students graduated successfully`,
        count: updatedStudents.count
      });
    }

    if (action === 'promote') {
      // Define promotion mapping
      const promotionMap = {
        'Form 1': 'Form 2',
        'Form 2': 'Form 3', 
        'Form 3': 'Form 4',
        'Form 4': 'Graduated'
      };

      const nextForm = promotionMap[form];
      
      if (!nextForm) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid form for promotion" 
        }, { status: 400 });
      }

      // 🔴 NEW: Check if the next form has existing students
      if (nextForm !== 'Graduated') {
        const existingStudentsInNextForm = await prisma.student.findMany({
          where: { 
            form: nextForm,
            status: { in: ["Active", "Transferred"] }
          }
        });

        if (existingStudentsInNextForm.length > 0) {
          return NextResponse.json({ 
            success: false, 
            error: `Cannot promote students to ${nextForm}. There are ${existingStudentsInNextForm.length} existing students in ${nextForm}. Please graduate the current ${nextForm} students first.` 
          }, { status: 400 });
        }
      }

      if (nextForm === 'Graduated') {
        // For graduation, include both Active and Transferred students
        const studentsToUpdate = await prisma.student.findMany({
          where: { 
            form: form,
            status: { in: ["Active", "Transferred"] }
          }
        });

        if (studentsToUpdate.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: `No students found in ${form} to graduate` 
          }, { status: 400 });
        }

        const updateResult = await prisma.student.updateMany({
          where: { 
            form: form,
            status: { in: ["Active", "Transferred"] }
          },
          data: {
            status: "Graduated"
          },
        });

        const promotionRecords = studentsToUpdate.map(student => ({
          studentId: student.id,
          fromForm: student.form,
          toForm: 'Graduated',
          fromStream: student.stream,
          toStream: student.stream,
          promotedBy: 'System'
        }));

        if (promotionRecords.length > 0) {
          await prisma.promotionHistory.createMany({
            data: promotionRecords
          });
        }

        return NextResponse.json({ 
          success: true, 
          message: `${updateResult.count} students graduated successfully`,
          count: updateResult.count
        });
      } else {
        // For promotion, include both Active and Transferred students
        const studentsToUpdate = await prisma.student.findMany({
          where: { 
            form: form,
            status: { in: ["Active", "Transferred"] }
          }
        });

        if (studentsToUpdate.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: `No students found in ${form} to promote` 
          }, { status: 400 });
        }

        // 🔴 Check again (redundant but safe)
        const existingStudentsInNextForm = await prisma.student.findMany({
          where: { 
            form: nextForm,
            status: { in: ["Active", "Transferred"] }
          }
        });

        if (existingStudentsInNextForm.length > 0) {
          return NextResponse.json({ 
            success: false, 
            error: `Cannot promote to ${nextForm}. There are existing students in that class.` 
          }, { status: 400 });
        }

        const updateResult = await prisma.student.updateMany({
          where: { 
            form: form,
            status: { in: ["Active", "Transferred"] }
          },
          data: {
            form: nextForm
          },
        });

        const promotionRecords = studentsToUpdate.map(student => ({
          studentId: student.id,
          fromForm: student.form,
          toForm: nextForm,
          fromStream: student.stream,
          toStream: student.stream,
          promotedBy: 'System'
        }));

        if (promotionRecords.length > 0) {
          await prisma.promotionHistory.createMany({
            data: promotionRecords
          });
        }

        return NextResponse.json({ 
          success: true, 
          message: `${updateResult.count} students promoted from ${form} to ${nextForm}`,
          count: updateResult.count
        });
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: "Invalid action" 
    }, { status: 400 });

  } catch (error) {
    console.error("❌ PATCH Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}